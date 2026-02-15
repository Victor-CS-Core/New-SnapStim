import express from 'express';
import { createStimuli } from '../lib/replicate';

const router = express.Router();

// Generate fresh preview content for generalization programs
router.post('/preview', async (req, res) => {
  try {
    const { programType, fields, sampleCount = 5 } = req.body;

    if (!programType || !fields) {
      return res.status(400).json({ 
        error: 'Missing required fields: programType and fields' 
      });
    }

    console.log(`[preview-generalization] Generating ${sampleCount} fresh samples for ${programType}`);
    console.log(`[preview-generalization] Received fields:`, fields);
    
    // Generate fresh stimuli using the same logic as program creation
    // but with a smaller sample size for preview
    const previewFields = {
      ...fields,
      numTrials: sampleCount,
      // Ensure title/description is forwarded for better category context
      title: fields.title || fields.categoryContext || '',
      description: fields.description || fields.programDescription || fields.categoryContext || '',
      // For VPMTS, limit categories and exemplars for preview
      numberOfCategories: programType === 'vpmts' ? Math.min(parseInt(fields.numberOfCategories || '2'), 2) : fields.numberOfCategories,
      numberOfExemplars: programType === 'vpmts' ? Math.min(parseInt(fields.numberOfExemplars || '3'), 3) : fields.numberOfExemplars,
    };

    console.log(`[preview-generalization] Processed fields:`, previewFields);

    const previewStimuli = await createStimuli(programType, previewFields);

    console.log(`[preview-generalization] Raw stimuli response:`, previewStimuli);

    // Transform the response to match expected format
    const stimuliItems = Array.isArray(previewStimuli) ? previewStimuli : previewStimuli.items || [];
    
    // CRITICAL: Ensure we only return the exact number requested
    const limitedItems = stimuliItems.slice(0, sampleCount);
    
    const freshContent = limitedItems.map((item: any, index: number) => ({
      id: `preview-${index}`,
      ...item,
      isPreview: true
    }));

    console.log(`[preview-generalization] Generated ${freshContent.length} preview items (limited from ${stimuliItems.length} to ${sampleCount})`);

    res.json({
      success: true,
      freshContent,
      programType,
      previewInfo: {
        sampleCount: freshContent.length,
        generatedAt: new Date().toISOString(),
        note: "This is preview content. Actual sessions will generate different items."
      }
    });

  } catch (error) {
    console.error('[preview-generalization] Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate preview content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;