# Firebase Storage Setup Guide

## Overview
This guide explains how to configure Firebase Storage for profile image uploads in SnapStim.

## Security Rules

You need to set up Firebase Storage security rules to allow authenticated users to upload and read images.

### Recommended Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Client avatar images
    match /client-avatars/{userId}/{fileName} {
      // Allow authenticated users to upload their own images
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024 // 5MB max
                   && request.resource.contentType.matches('image/.*');
      
      // Allow authenticated users to read all client avatars
      allow read: if request.auth != null;
    }
    
    // Future: Add rules for other folders as needed
    // match /program-images/{userId}/{fileName} { ... }
    // match /session-logs/{userId}/{fileName} { ... }
  }
}
```

### Setting Up Rules

1. **Go to Firebase Console**
   - Open [Firebase Console](https://console.firebase.google.com/)
   - Select your project

2. **Navigate to Storage**
   - Click "Storage" in the left sidebar
   - Click "Rules" tab at the top

3. **Update Rules**
   - Copy the rules above
   - Paste into the rules editor
   - Click "Publish"

### Rule Explanation

- **`request.auth != null`**: Only authenticated users can upload/read
- **`request.auth.uid == userId`**: Users can only upload to their own folder
- **`request.resource.size < 5 * 1024 * 1024`**: Maximum file size is 5MB
- **`request.resource.contentType.matches('image/.*')`**: Only image files allowed
- **`allow read: if request.auth != null`**: Any authenticated user can view avatars

## Testing

### Test Upload
1. Log in to the app
2. Go to Clients page
3. Click "Add Client"
4. Click "Upload Image"
5. Select an image file (JPG, PNG, or GIF)
6. Wait for upload progress to complete
7. Submit the form

### Verify Upload
- Check Firebase Console → Storage → Files
- You should see: `client-avatars/{userId}/{timestamp}_{filename}`

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `storage/unauthorized` | Storage rules not set up | Follow setup guide above |
| `storage/quota-exceeded` | Free tier limit reached | Upgrade Firebase plan |
| File size too large | Image > 5MB | Use smaller images |
| Invalid file type | Not an image file | Only upload JPG/PNG/GIF |

## Storage Structure

```
gs://your-project.appspot.com/
└── client-avatars/
    └── {userId}/
        └── {timestamp}_{originalFilename}
```

### Example Path
```
client-avatars/abc123def456/1708041234567_emma_profile.jpg
```

## Features Implemented

### Profile Image Handling
- ✅ **Profile images are completely optional**
- ✅ Clients without images display **initials as fallback** (e.g., "ER" for Emma Rodriguez)
- ✅ Avatar component automatically handles missing/failed images
- ✅ Form submission works with or without an image

### Image Upload Hook (`useImageUpload.ts`)
- ✅ File type validation (images only)
- ✅ File size validation (5MB max)
- ✅ Progress tracking
- ✅ Error handling with friendly messages
- ✅ Unique filename generation
- ✅ Custom metadata (uploadedBy, originalName, uploadTime)

### Add Client Modal
- ✅ **Optional** - clients can be created without images
- ✅ Fallback to initials when no image provided
- ✅ Image preview before upload
- ✅ Upload progress indicator
- ✅ Remove image functionality
- ✅ Form disabled during upload
- ✅ Error messages display

### Edit Client Modal
- ✅ Shows existing avatar
- ✅ Upload new image to replace
- ✅ All Add Client features
- ✅ Preserves existing image if not changed

## Environment Variables

Ensure these are set in your `.env` file:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com  # Important!
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Next Steps

1. Set up Firebase Storage rules (see above)
2. Test image upload functionality
3. Monitor Firebase Console for uploaded files
4. Consider implementing image optimization (future)
5. Add image deletion when client is deleted (future)

## Future Enhancements

- [ ] Image compression before upload
- [ ] Image cropping/resizing UI
- [ ] Multiple image upload for programs/sessions
- [ ] Image deletion from Storage when client deleted
- [ ] CDN integration for faster loading
- [ ] Thumbnail generation (Cloud Functions)

---

**Last Updated**: February 15, 2026
**Status**: Ready for Testing
