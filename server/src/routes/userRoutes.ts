/**
 * User Management Routes
 * Handles user CRUD operations for therapists, BCBAs, RBTs, and caregivers
 */

import { Request, Response } from 'express';
// @ts-ignore - firebase.js is a JavaScript file
import { db } from '../firebase';

/**
 * Map Firestore user document to frontend User type
 * Converts snake_case backend fields to camelCase frontend fields
 */
function mapUserToFrontend(firestoreUser: any): any {
  const { user_id, created_at, updated_at, last_active_at, ...rest } = firestoreUser;
  return {
    ...rest,
    id: user_id,
    createdAt: created_at,
    updatedAt: updated_at,
    lastActiveAt: last_active_at,
  };
}

/**
 * Map frontend User type to Firestore structure
 * Converts camelCase frontend fields to snake_case backend fields
 */
function mapUserToFirestore(frontendUser: any): any {
  const { id, createdAt, updatedAt, lastActiveAt, ...rest } = frontendUser;
  return {
    ...rest,
    user_id: id,
    created_at: createdAt,
    updated_at: updatedAt,
    last_active_at: lastActiveAt,
  };
}

/**
 * Save (create or update) a user
 * POST /api/user/save
 */
export async function saveUser(req: Request, res: Response) {
  try {
    const { userId, userData } = req.body;

    if (!userId || !userData) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: userId, userData',
      });
    }

    // Validation
    if (!userData.email || !userData.name || !userData.role) {
      return res.status(400).json({
        ok: false,
        error: 'User data must include: email, name, role',
      });
    }

    // Convert frontend format to Firestore format
    const timestamp = new Date().toISOString();
    const userRecord = mapUserToFirestore({
      ...userData,
      id: userId,
      updatedAt: timestamp,
      createdAt: userData.createdAt || timestamp,
      status: userData.status || 'Active',
    });

    // Save to Firestore
    const userRef = db.collection('users').doc(userId);
    await userRef.set(userRecord, { merge: true });

    console.log(`[user] Saved user: ${userId}`);
    
    // Return frontend format
    const savedUser = mapUserToFrontend(userRecord);
    return res.json({ ok: true, user: savedUser });
  } catch (error: any) {
    console.error('[user] Error saving user:', error);
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Failed to save user',
    });
  }
}

/**
 * List all users (optionally filtered)
 * GET /api/users/list?role=BCBA&status=active
 */
export async function listUsers(req: Request, res: Response) {
  try {
    const { role, status, search } = req.query;

    let query = db.collection('users');

    // Apply filters
    if (role) {
      query = query.where('role', '==', role) as any;
    }
    if (status) {
      query = query.where('status', '==', status) as any;
    }

    const snapshot = await query.get();
    let users = snapshot.docs.map((doc: any) => doc.data());

    // Apply search filter (client-side since Firestore doesn't support LIKE)
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (user: any) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
      );
    }

    // Map to frontend format
    const frontendUsers = users.map(mapUserToFrontend);

    console.log(`[user] Listed ${frontendUsers.length} users`);
    return res.json({ ok: true, users: frontendUsers });
  } catch (error: any) {
    console.error('[user] Error listing users:', error);
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Failed to list users',
    });
  }
}

/**
 * Get a single user by ID
 * GET /api/user/:userId
 */
export async function getUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing userId parameter',
      });
    }

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        ok: false,
        error: 'User not found',
      });
    }

    const user = mapUserToFrontend(userDoc.data());
    console.log(`[user] Retrieved user: ${userId}`);
    return res.json({ ok: true, user });
  } catch (error: any) {
    console.error('[user] Error getting user:', error);
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Failed to get user',
    });
  }
}

/**
 * Update a user
 * PUT /api/user/update
 */
export async function updateUser(req: Request, res: Response) {
  try {
    const { userId, updates } = req.body;

    if (!userId || !updates) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: userId, updates',
      });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        ok: false,
        error: 'User not found',
      });
    }

    // Convert frontend updates to Firestore format
    const timestamp = new Date().toISOString();
    const updatesFirestore = mapUserToFirestore({
      ...updates,
      updatedAt: timestamp,
    });

    await userRef.update(updatesFirestore);

    const updatedFirestore = { ...userDoc.data(), ...updatesFirestore };
    const updatedUser = mapUserToFrontend(updatedFirestore);
    
    console.log(`[user] Updated user: ${userId}`);
    return res.json({ ok: true, user: updatedUser });
  } catch (error: any) {
    console.error('[user] Error updating user:', error);
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Failed to update user',
    });
  }
}

/**
 * Delete a user (soft delete by setting status to 'inactive')
 * DELETE /api/user/delete
 */
export async function deleteUser(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing userId',
      });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        ok: false,
        error: 'User not found',
      });
    }

    // Soft delete by setting status to Inactive (capitalize to match frontend)
    const timestamp = new Date().toISOString();
    await userRef.update({
      status: 'Inactive',
      deactivated_at: timestamp,
      updated_at: timestamp,
    });

    console.log(`[user] Deleted (soft) user: ${userId}`);
    return res.json({ ok: true, message: 'User deactivated successfully' });
  } catch (error: any) {
    console.error('[user] Error deleting user:', error);
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Failed to delete user',
    });
  }
}

/**
 * Send invitation email to a new user
 * POST /api/user/invite
 */
export async function inviteUser(req: Request, res: Response) {
  try {
    const { email, role, name } = req.body;

    if (!email || !role || !name) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: email, role, name',
      });
    }

    // Generate temporary user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create pending user record
    const timestamp = new Date().toISOString();
    const userRecord = mapUserToFirestore({
      id: userId,
      email,
      name,
      role,
      status: 'Pending',
      invitedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await db.collection('users').doc(userId).set(userRecord);

    // TODO: Send invitation email via SendGrid/Firebase
    // For now, just return success
    console.log(`[user] Invited user: ${email} as ${role}`);

    return res.json({
      ok: true,
      message: 'Invitation sent successfully',
      userId,
    });
  } catch (error: any) {
    console.error('[user] Error inviting user:', error);
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Failed to invite user',
    });
  }
}
