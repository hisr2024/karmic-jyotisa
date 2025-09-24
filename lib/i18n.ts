import type { Lang } from './types'
export const t = (key:string, lang:Lang):string => {
  const m: Record<string, Record<Lang,string>> = {
    'ui.title': { en:'Karmic Jyotiṣa', hi:'कर्मिक ज्योतिष', sa:'कर्मिक-ज्योतिष' },
    'ui.subtitle': { en:'Past‑life themes with clear, kind explanations.', hi:'पिछले जन्म की प्रवृत्तियाँ—स्पष्ट व सरल व्याख्या सहित।', sa:'पूर्वजन्मवृत्तयः — सुस्पष्ट-सरलव्याख्यया सह।' },
    'ui.confidence': { en:'Confidence', hi:'विश्वास', sa:'विश्वासः' },
    'ui.download': { en:'Download Report', hi:'रिपोर्ट डाउनलोड करें', sa:'प्रतिवेदनं डाउनलोड कुरुत' },

    'theme.scholar': { en:'Scholar Energy', hi:'विद्याप्रवृत्ति', sa:'विद्याशक्ति' },
    'theme.scholar.head': { en:'Your chart carries the vibe of learning and shared wisdom.', hi:'आपकी कुण्डली में शिक्षा व ज्ञान-साझा करने की प्रवृत्ति दीखती है।', sa:'भवच्चक्रे अध्ययन-ज्ञानस्य प्रवृत्तिर्दृश्यते।' },

    'bubble.simple': { en:'Simple', hi:'सरल', sa:'सरलम्' },
    'bubble.sanskrit': { en:'Sanskrit', hi:'संस्कृत', sa:'संस्कृतम्' },
    'bubble.commentary': { en:'Commentary', hi:'टीका', sa:'टीका' },

    'lesson.title': { en:'Lesson', hi:'सीख', sa:'पाठः' },
    'remedy.title': { en:'Gentle Remedy', hi:'उपाय', sa:'उपायः' },
  }
  return m[key]?.[lang] ?? key
}
