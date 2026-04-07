import type { TopicLearnContent, TopicId } from '../types'

// ─── Learn Content ────────────────────────────────────────────────────────────
// All explanation text is stored in female form.
// The LearnPage passes strings through theme.g() to transform to male where needed.

const addition: TopicLearnContent = {
  topicId: 'addition',
  subtitleHebrew: 'איך מחברים מספרים?',
  slides: [
    {
      id: 'add_1',
      explanationHebrew:
        'חיבור הוא פעולה שמאגדת כמויות יחד. כשמחברים שני מספרים מקבלים מספר גדול יותר שנקרא סכום. הסדר לא משנה — 3 + 5 שווה בדיוק כמו 5 + 3.',
      visualExample: '🍎🍎🍎  +  🍎🍎  =  🍎🍎🍎🍎🍎',
      visualType: 'emoji_grid',
      validationQuestions: [
        {
          prompt: 'כמה זה 3 + 2?',
          expression: '3 + 2 = ?',
          answer: 5,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '4', value: 4 },
            { id: '1', label: '5', value: 5 },
            { id: '2', label: '6', value: 6 },
            { id: '3', label: '7', value: 7 },
          ],
          hintText: 'ספרי את התפוחים בציור — שלושה ועוד שניים.',
        },
      ],
    },
    {
      id: 'add_2',
      explanationHebrew:
        'כשמחברים מספרים גדולים, עוזר לפרק אותם לעשרות ויחידות. למשל: 34 + 25 = (30 + 20) + (4 + 5) = 50 + 9 = 59. קודם מחברים את העשרות, אחר-כך את היחידות!',
      visualExample: '34 + 25 = (30+20) + (4+5) = 50 + 9 = 59',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 34 + 25?',
          expression: '34 + 25 = ?',
          answer: 59,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '55', value: 55 },
            { id: '1', label: '57', value: 57 },
            { id: '2', label: '59', value: 59 },
            { id: '3', label: '61', value: 61 },
          ],
          hintText: 'פרקי: (30+20) + (4+5) = 50 + 9',
        },
      ],
    },
    {
      id: 'add_3',
      explanationHebrew:
        'כשמחברים שלושה מספרים, אפשר לבחור באיזה סדר לחבר — התוצאה תמיד אותה! טריק מועיל: חפשי זוגות שמסתכמים ל-10. למשל בחיבור 7 + 3 + 8 — קודם 7 + 3 = 10, ואז 10 + 8 = 18.',
      visualExample: '7 + 3 + 8 = (7+3) + 8 = 10 + 8 = 18',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 7 + 3 + 8?',
          expression: '7 + 3 + 8 = ?',
          answer: 18,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '17', value: 17 },
            { id: '1', label: '18', value: 18 },
            { id: '2', label: '19', value: 19 },
            { id: '3', label: '20', value: 20 },
          ],
          hintText: 'קודם 7 + 3 = 10, ואז 10 + 8 = ?',
        },
      ],
    },
  ],
}

const subtraction: TopicLearnContent = {
  topicId: 'subtraction',
  subtitleHebrew: 'איך מחסרים מספרים?',
  slides: [
    {
      id: 'sub_1',
      explanationHebrew:
        'חיסור הוא פעולה שמוצאת את ההפרש בין שני מספרים. כשמחסרים אנחנו שואלים: "כמה נשאר?" מהמספר הגדול מורידים את המספר הקטן.',
      visualExample: '🍕🍕🍕🍕🍕  −  🍕🍕  =  🍕🍕🍕',
      visualType: 'emoji_grid',
      validationQuestions: [
        {
          prompt: 'כמה זה 5 - 2?',
          expression: '5 − 2 = ?',
          answer: 3,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '2', value: 2 },
            { id: '1', label: '3', value: 3 },
            { id: '2', label: '4', value: 4 },
            { id: '3', label: '7', value: 7 },
          ],
          hintText: 'מתחמש פיצות מורידים שתיים — כמה נשאר?',
        },
      ],
    },
    {
      id: 'sub_2',
      explanationHebrew:
        'טריק שימושי לחיסור: חשבי כמה צריך להוסיף למספר הקטן כדי להגיע למספר הגדול. למשל: 52 − 38 = ? שאלי: 38 + כמה = 52? התשובה היא 14, ולכן גם 52 − 38 = 14.',
      visualExample: '52 − 38 = ?   →   38 + 14 = 52   ✓',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 53 - 28?',
          expression: '53 − 28 = ?',
          answer: 25,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '24', value: 24 },
            { id: '1', label: '25', value: 25 },
            { id: '2', label: '26', value: 26 },
            { id: '3', label: '35', value: 35 },
          ],
          hintText: '28 + כמה = 53? נסי: 28 + 25 = ?',
        },
      ],
    },
    {
      id: 'sub_3',
      explanationHebrew:
        'תמיד אפשר לבדוק תשובה של חיסור עם חיבור! אם 52 − 38 = 14, אז 38 + 14 חייב להיות 52. זהו כלי מצוין לבדיקה עצמית — אם החיבור מסתדר, התשובה נכונה.',
      visualExample: '60 − 25 = 35   →   בדיקה: 25 + 35 = 60   ✓',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'אם 60 - 25 = 35, מה זה 35 + 25?',
          expression: '35 + 25 = ?',
          answer: 60,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '55', value: 55 },
            { id: '1', label: '60', value: 60 },
            { id: '2', label: '65', value: 65 },
            { id: '3', label: '70', value: 70 },
          ],
          hintText: 'חיבור וחיסור הם פעולות הפוכות — התשובה חייבת לחזור למספר המקורי.',
        },
      ],
    },
  ],
}

const multiplication: TopicLearnContent = {
  topicId: 'multiplication',
  subtitleHebrew: 'איך מכפילים מספרים?',
  slides: [
    {
      id: 'mul_1',
      explanationHebrew:
        'כפל הוא דרך קצרה לחיבור חוזר. 4 × 3 פירושו 4 קבוצות של 3, כלומר 3 + 3 + 3 + 3 = 12. הסדר לא משנה: 4 × 3 = 3 × 4 = 12.',
      visualExample: '🌟🌟🌟 | 🌟🌟🌟 | 🌟🌟🌟 | 🌟🌟🌟\n4 קבוצות × 3 = 12',
      visualType: 'emoji_grid',
      validationQuestions: [
        {
          prompt: 'כמה זה 5 × 3?',
          expression: '5 × 3 = ?',
          answer: 15,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '12', value: 12 },
            { id: '1', label: '13', value: 13 },
            { id: '2', label: '15', value: 15 },
            { id: '3', label: '18', value: 18 },
          ],
          hintText: 'חמש קבוצות של שלוש: 3+3+3+3+3 = ?',
        },
      ],
    },
    {
      id: 'mul_2',
      explanationHebrew:
        'יש טריקים נוחים לטבלת הכפל! כפל ב-10: מוסיפים 0 בסוף. כפל ב-5: חצי מהכפל ב-10. למשל: 7 × 5 = 7 × 10 ÷ 2 = 70 ÷ 2 = 35. כפל ב-9: הספרות של התוצאה תמיד מסתכמות ל-9.',
      visualExample: '8 × 5 = 8 × 10 ÷ 2 = 80 ÷ 2 = 40',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 8 × 5?',
          expression: '8 × 5 = ?',
          answer: 40,
          type: 'numeric_input',
          hintText: '8 × 10 = 80, ולכן 8 × 5 = 80 ÷ 2 = ?',
        },
      ],
    },
    {
      id: 'mul_3',
      explanationHebrew:
        'לכפל מספר דו-ספרתי, מפרקים אותו לעשרות ויחידות. 23 × 4 = (20 × 4) + (3 × 4) = 80 + 12 = 92. זו שיטה שנקראת "חוק הפילוג" — מפלגים ומכפילים כל חלק בנפרד.',
      visualExample: '23 × 4 = (20×4) + (3×4) = 80 + 12 = 92',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 32 × 3?',
          expression: '32 × 3 = ?',
          answer: 96,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '86', value: 86 },
            { id: '1', label: '93', value: 93 },
            { id: '2', label: '96', value: 96 },
            { id: '3', label: '99', value: 99 },
          ],
          hintText: '(30 × 3) + (2 × 3) = 90 + 6 = ?',
        },
      ],
    },
  ],
}

const division: TopicLearnContent = {
  topicId: 'division',
  subtitleHebrew: 'איך מחלקים מספרים?',
  slides: [
    {
      id: 'div_1',
      explanationHebrew:
        'חילוק הוא חלוקה שווה לקבוצות. 12 ÷ 3 פירושו: לחלק 12 פריטים ל-3 קבוצות שוות. כל קבוצה מקבלת 4. אפשר לחשוב גם כך: 3 × כמה = 12?',
      visualExample: '🍬🍬🍬🍬 | 🍬🍬🍬🍬 | 🍬🍬🍬🍬\n12 ÷ 3 = 4',
      visualType: 'emoji_grid',
      validationQuestions: [
        {
          prompt: 'כמה זה 15 ÷ 3?',
          expression: '15 ÷ 3 = ?',
          answer: 5,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '3', value: 3 },
            { id: '1', label: '4', value: 4 },
            { id: '2', label: '5', value: 5 },
            { id: '3', label: '6', value: 6 },
          ],
          hintText: '3 × כמה = 15?',
        },
      ],
    },
    {
      id: 'div_2',
      explanationHebrew:
        'לפעמים החלוקה לא שווה בדיוק, ונשאר שארית. למשל: 13 ÷ 4 = 3 שארית 1, כי 4 × 3 = 12, ו-13 − 12 = 1. השארית תמיד קטנה מהמחלק.',
      visualExample: '13 ÷ 4 = 3 שארית 1\nכי: 4 × 3 = 12,  13 − 12 = 1',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'מה שארית 17 ÷ 5?',
          expression: '17 ÷ 5 = 3 שארית ?',
          answer: 2,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '1', value: 1 },
            { id: '1', label: '2', value: 2 },
            { id: '2', label: '3', value: 3 },
            { id: '3', label: '4', value: 4 },
          ],
          hintText: '5 × 3 = 15, ו-17 − 15 = ?',
        },
      ],
    },
    {
      id: 'div_3',
      explanationHebrew:
        'כפל וחילוק הם פעולות הפוכות — משפחת מספרים! אם יודעים ש-6 × 7 = 42, אז ישר יודעים גם ש-42 ÷ 7 = 6 וגם ש-42 ÷ 6 = 7. לכן ידיעת לוח הכפל עוזרת גם בחילוק.',
      visualExample: '6 × 7 = 42   →   42 ÷ 7 = 6   ✓\n                  42 ÷ 6 = 7   ✓',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 56 ÷ 8?',
          expression: '56 ÷ 8 = ?',
          answer: 7,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '6', value: 6 },
            { id: '1', label: '7', value: 7 },
            { id: '2', label: '8', value: 8 },
            { id: '3', label: '9', value: 9 },
          ],
          hintText: '8 × כמה = 56? חשבי על לוח הכפל של 8.',
        },
      ],
    },
  ],
}

const fractions: TopicLearnContent = {
  topicId: 'fractions',
  subtitleHebrew: 'מה זה שברים ואיך עובדים איתם?',
  slides: [
    {
      id: 'frac_1',
      explanationHebrew:
        'שבר מייצג חלק מתוך שלם. המספר למטה נקרא מכנה — הוא אומר לכמה חלקים שווים חולק השלם. המספר למעלה נקרא מונה — הוא אומר כמה חלקים כאלה יש לנו.',
      visualExample: '🍕🍕🍕  מתוך  🍕🍕🍕🍕🍕🍕🍕🍕\n= 3/8 (שלושה חלקים מתוך שמונה)',
      visualType: 'emoji_grid',
      validationQuestions: [
        {
          prompt: 'פיצה חולקה ל-8 חלקים שווים. אכלת 3 חלקים. מה השבר?',
          answer: '3/8',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '3/8', value: '3/8' },
            { id: '1', label: '8/3', value: '8/3' },
            { id: '2', label: '5/8', value: '5/8' },
            { id: '3', label: '1/3', value: '1/3' },
          ],
          hintText: 'המונה = כמה חלקים אכלת. המכנה = כמה חלקים סה"כ.',
        },
      ],
    },
    {
      id: 'frac_2',
      explanationHebrew:
        'שברים שקולים הם שברים שמייצגים את אותה כמות, אבל כתובים בצורה שונה. למשל: 1/2 = 2/4 = 3/6. הסוד: כופלים או מחלקים את המונה ואת המכנה באותו מספר.',
      visualExample: '1/2 = 2/4 = 3/6 = 4/8\n(כפלנו את המונה והמכנה ב-2, 3, 4...)',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'איזה שבר שקול ל- 1/2?',
          expression: '1/2 = ?',
          answer: '3/6',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '2/3', value: '2/3' },
            { id: '1', label: '3/6', value: '3/6' },
            { id: '2', label: '4/5', value: '4/5' },
            { id: '3', label: '2/8', value: '2/8' },
          ],
          hintText: '1/2 — כפלי מונה ומכנה ב-3: 1×3 / 2×3 = ?',
        },
      ],
    },
    {
      id: 'frac_3',
      explanationHebrew:
        'כשמחברים שברים עם אותו מכנה, מחברים רק את המונים! המכנה נשאר אותו דבר. למשל: 2/7 + 3/7 = 5/7. חשוב: לא מחברים את המכנים!',
      visualExample: '2/7 + 3/7 = (2+3)/7 = 5/7',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 3/8 + 2/8?',
          expression: '3/8 + 2/8 = ?',
          answer: '5/8',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '5/8', value: '5/8' },
            { id: '1', label: '5/16', value: '5/16' },
            { id: '2', label: '6/8', value: '6/8' },
            { id: '3', label: '1/2', value: '1/2' },
          ],
          hintText: 'מחברים רק את המונים (3+2), המכנה נשאר 8.',
        },
      ],
    },
    {
      id: 'frac_4',
      explanationHebrew:
        'צמצום שבר = לכתוב אותו בצורה הפשוטה ביותר. מחלקים את המונה ואת המכנה במחלק המשותף הגדול ביותר (מ"מג). למשל: 6/8 — המ"מג של 6 ו-8 הוא 2, לכן 6/8 ÷ 2/2 = 3/4.',
      visualExample: '6/8 ÷ 2 = 3/4\n(מחלקים מונה ומכנה ב-2)',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'מה הצורה הפשוטה של 4/6?',
          expression: '4/6 = ?',
          answer: '2/3',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '2/3', value: '2/3' },
            { id: '1', label: '1/3', value: '1/3' },
            { id: '2', label: '3/4', value: '3/4' },
            { id: '3', label: '4/6', value: '4/6' },
          ],
          hintText: 'המ"מג של 4 ו-6 הוא 2. חלקי מונה ומכנה ב-2.',
        },
      ],
    },
  ],
}

const decimals: TopicLearnContent = {
  topicId: 'decimals',
  subtitleHebrew: 'מה זה מספרים עשרוניים?',
  slides: [
    {
      id: 'dec_1',
      explanationHebrew:
        'מספרים עשרוניים מייצגים שברים בצורה מיוחדת. הנקודה העשרונית מפרידה בין החלק השלם לחלקי השלם. הספרה מיד אחרי הנקודה היא עשיריות, השנייה היא מאיות. לדוגמה: 0.5 = חצי, 0.25 = רבע.',
      visualExample: '0.5  = 5/10  = 1/2\n0.25 = 25/100 = 1/4\n0.75 = 75/100 = 3/4',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'מה גדול יותר: 0.5 או 0.25?',
          answer: '0.5',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '0.5', value: '0.5' },
            { id: '1', label: '0.25', value: '0.25' },
            { id: '2', label: 'שווים', value: 'שווים' },
          ],
          hintText: '0.5 = 5 עשיריות, 0.25 = 2 עשיריות ו-5 מאיות. מה גדול יותר?',
        },
      ],
    },
    {
      id: 'dec_2',
      explanationHebrew:
        'כשמחברים מספרים עשרוניים, חשוב ליישר את הנקודות העשרוניות זו מול זו. עשיריות עם עשיריות, מאיות עם מאיות. אם חסרה ספרה — כותבים 0. למשל: 1.3 + 2.4 = 3.7.',
      visualExample: '  1.3 0\n+ 2.4 5\n------\n  3.7 5',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 1.5 + 2.3?',
          expression: '1.5 + 2.3 = ?',
          answer: 3.8,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '3.2', value: 3.2 },
            { id: '1', label: '3.5', value: 3.5 },
            { id: '2', label: '3.8', value: 3.8 },
            { id: '3', label: '4.2', value: 4.2 },
          ],
          hintText: 'ישרי נקודות: 1.5 + 2.3. חברי עשיריות עם עשיריות: 5+3=8.',
        },
      ],
    },
    {
      id: 'dec_3',
      explanationHebrew:
        'כשמכפילים מספר עשרוני ב-10, הנקודה זזה ספרה אחת ימינה (המספר גדל פי 10). ב-100 — שתי ספרות ימינה. לדוגמה: 0.7 × 10 = 7, ו-0.35 × 100 = 35. שימושי מאוד לחישובי אחוזים!',
      visualExample: '0.35 × 10  = 3.5\n0.35 × 100 = 35',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 0.6 × 10?',
          expression: '0.6 × 10 = ?',
          answer: 6,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '0.06', value: 0.06 },
            { id: '1', label: '0.6', value: 0.6 },
            { id: '2', label: '6', value: 6 },
            { id: '3', label: '60', value: 60 },
          ],
          hintText: 'כשמכפילים ב-10, הנקודה זזה ספרה אחת ימינה: 0.6 → 6.',
        },
      ],
    },
  ],
}

const percentages: TopicLearnContent = {
  topicId: 'percentages',
  subtitleHebrew: 'מה זה אחוזים ואיך מחשבים?',
  slides: [
    {
      id: 'pct_1',
      explanationHebrew:
        'אחוז הוא שבר שתמיד יש לו מכנה של 100. "אחוז" פירושו "מתוך מאה". 100% = הכל. 50% = חצי. 25% = רבע. 10% = עשירית. אחוזים שימושיים להשוואת כמויות שונות.',
      visualExample: '100% = כל המנה 🍰\n 50% = חצי    🍰/2\n 25% = רבע    🍰/4',
      visualType: 'emoji_grid',
      validationQuestions: [
        {
          prompt: 'מה שווה 50%?',
          answer: 'חצי',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: 'כל מה שיש', value: 'כל מה שיש' },
            { id: '1', label: 'חצי', value: 'חצי' },
            { id: '2', label: 'רבע', value: 'רבע' },
            { id: '3', label: 'עשירית', value: 'עשירית' },
          ],
          hintText: '50 מתוך 100 = 50/100 = 1/2 = ?',
        },
      ],
    },
    {
      id: 'pct_2',
      explanationHebrew:
        'לחשב X% מ-Y: מכפילים Y ב-X ומחלקים ב-100. טריק קל: 10% = לחלק ב-10. מ-10% קל לחשב: 20% = 10% × 2, ו-5% = 10% ÷ 2, ו-30% = 10% × 3, וכן הלאה.',
      visualExample: '20% מ-60:\n60 ÷ 10 = 6  (זה 10%)\n6 × 2 = 12  (זה 20%)',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'כמה זה 10% מ-80?',
          expression: '10% מ-80 = ?',
          answer: 8,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '8', value: 8 },
            { id: '1', label: '10', value: 10 },
            { id: '2', label: '16', value: 16 },
            { id: '3', label: '18', value: 18 },
          ],
          hintText: '10% = לחלק ב-10. כמה זה 80 ÷ 10?',
        },
      ],
    },
    {
      id: 'pct_3',
      explanationHebrew:
        'עליית מחיר: מחשבים כמה האחוז ומוסיפים למחיר. הנחה: מחשבים כמה האחוז ומחסרים מהמחיר. מחיר 200 ₪ עם הנחה של 10%: 200 × 10% = 20, ולכן 200 − 20 = 180 ₪.',
      visualExample: 'הנחה 10% על 200 ₪:\n200 ÷ 10 = 20 (ה-10%)\n200 − 20 = 180 ₪',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'מחיר מקורי 100 ₪, הנחה 20%. מה המחיר החדש?',
          expression: '100 ₪ − 20% = ?',
          answer: 80,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '20 ₪', value: 20 },
            { id: '1', label: '80 ₪', value: 80 },
            { id: '2', label: '120 ₪', value: 120 },
            { id: '3', label: '200 ₪', value: 200 },
          ],
          hintText: '20% מ-100 = 20. מחסירים מהמחיר: 100 − 20 = ?',
        },
      ],
    },
  ],
}

const geometry: TopicLearnContent = {
  topicId: 'geometry',
  subtitleHebrew: 'שטחים והיקפים של צורות',
  slides: [
    {
      id: 'geo_1',
      explanationHebrew:
        'שטח הוא המקום שצורה תופסת. שטח מלבן = אורך × רוחב. יחידת המידה היא יחידה מרובעת (למשל ס"מ² או מ"ר). מלבן בגודל 5 × 3 ס"מ מכיל 15 ריבועים קטנים — לכן שטחו 15 ס"מ².',
      visualExample: '┌──────┐\n│      │ 3 ס"מ\n└──────┘\n  5 ס"מ\nשטח = 5 × 3 = 15 ס"מ²',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'מלבן עם אורך 6 ס"מ ורוחב 4 ס"מ. מה שטחו?',
          expression: 'שטח = 6 × 4 = ?',
          answer: 24,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '10 ס"מ²', value: 10 },
            { id: '1', label: '20 ס"מ²', value: 20 },
            { id: '2', label: '24 ס"מ²', value: 24 },
            { id: '3', label: '30 ס"מ²', value: 30 },
          ],
          hintText: 'שטח מלבן = אורך × רוחב = 6 × 4 = ?',
        },
      ],
    },
    {
      id: 'geo_2',
      explanationHebrew:
        'שטח משולש שווה בדיוק חצי משטח המלבן שמכיל אותו. שטח משולש = (בסיס × גובה) ÷ 2. חשוב: הגובה הוא הניצב (90°) לבסיס — לא בהכרח הצלע עצמה!',
      visualExample: 'שטח = (בסיס × גובה) ÷ 2\n= (8 × 6) ÷ 2\n= 48 ÷ 2 = 24 ס"מ²',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'משולש עם בסיס 8 ס"מ וגובה 5 ס"מ. מה שטחו?',
          expression: '(8 × 5) ÷ 2 = ?',
          answer: 20,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '13 ס"מ²', value: 13 },
            { id: '1', label: '20 ס"מ²', value: 20 },
            { id: '2', label: '40 ס"מ²', value: 40 },
            { id: '3', label: '80 ס"מ²', value: 80 },
          ],
          hintText: '(8 × 5) ÷ 2 = 40 ÷ 2 = ?',
        },
      ],
    },
    {
      id: 'geo_3',
      explanationHebrew:
        'היקף הוא אורך הגבול של הצורה — סכום כל הצלעות. היקף מרובע = 4 × צלע. היקף מלבן = 2 × (אורך + רוחב). למה כפול 2? כי יש שתי זוגות של צלעות שוות.',
      visualExample: 'מלבן 7 × 3:\nהיקף = 2 × (7+3) = 2 × 10 = 20 ס"מ',
      visualType: 'expression',
      validationQuestions: [
        {
          prompt: 'מה ההיקף של מרובע עם צלע 5 ס"מ?',
          expression: 'היקף = 4 × 5 = ?',
          answer: 20,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '10 ס"מ', value: 10 },
            { id: '1', label: '15 ס"מ', value: 15 },
            { id: '2', label: '20 ס"מ', value: 20 },
            { id: '3', label: '25 ס"מ', value: 25 },
          ],
          hintText: 'היקף מרובע = 4 × צלע = 4 × 5 = ?',
        },
      ],
    },
  ],
}

const wordProblems: TopicLearnContent = {
  topicId: 'wordProblems',
  subtitleHebrew: 'איך פותרים בעיות מילוליות?',
  slides: [
    {
      id: 'wp_1',
      explanationHebrew:
        'כשפותרים בעיה מילולית, קוראים פעמיים! בקריאה הראשונה מבינים את הסיפור. בשנייה מזהים: מה נתון (המספרים שיש לנו), מה נשאל (מה צריך למצוא), ואיזו פעולה צריך לבצע.',
      visualExample: 'קראי → זהי נתונים → זהי נשאל → פתרי',
      visualType: 'text',
      validationQuestions: [
        {
          prompt: 'אם בעיה שואלת "כמה נשאר?" — איזו פעולה כנראה נדרשת?',
          answer: 'חיסור',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: 'חיבור', value: 'חיבור' },
            { id: '1', label: 'חיסור', value: 'חיסור' },
            { id: '2', label: 'כפל', value: 'כפל' },
            { id: '3', label: 'חילוק', value: 'חילוק' },
          ],
          hintText: '"כמה נשאר?" = מה ההפרש = ?',
        },
      ],
    },
    {
      id: 'wp_2',
      explanationHebrew:
        'אחרי שמזהים את הנתונים ומה נשאל, כותבים משוואה. "לתמר היו 15 סוכריות, היא נתנה 6 לחברה — כמה נשארו?" → נתון: 15 וגם 6. נשאל: כמה נשאר? פעולה: חיסור. 15 − 6 = 9.',
      visualExample: 'נתון: 15 סוכריות, נתנה 6\nנשאל: כמה נשאר?\n15 − 6 = 9 סוכריות ✓',
      visualType: 'text',
      validationQuestions: [
        {
          prompt: 'רון קנה 4 מחברות ב-7 ₪ כל אחת. כמה שילם בסך הכל?',
          expression: '4 × 7 = ?',
          answer: 28,
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '11 ₪', value: 11 },
            { id: '1', label: '28 ₪', value: 28 },
            { id: '2', label: '47 ₪', value: 47 },
            { id: '3', label: '74 ₪', value: 74 },
          ],
          hintText: '4 מחברות × 7 ₪ = ? (כפל)',
        },
      ],
    },
    {
      id: 'wp_3',
      explanationHebrew:
        'אחרי שפתרת — תמיד בדקי! הכנסי את התשובה חזרה לבעיה וראי אם היא הגיונית. "9 סוכריות הגיוני אם התחלנו עם 15 ונתנו 6?" — כן! 6 + 9 = 15. גם שאלי: האם המספר בסדר גודל הגיוני?',
      visualExample: 'פתרון: 15 − 6 = 9\nבדיקה: 6 + 9 = 15 ✓\nהגיוני? כן ✓',
      visualType: 'text',
      validationQuestions: [
        {
          prompt: 'לכיתה יש 32 תלמידים, ל-20 יש אופניים. כמה אין להם אופניים? מה הבדיקה?',
          expression: '32 − 20 = 12   בדיקה: ?',
          answer: '20+12=32',
          type: 'multiple_choice',
          choices: [
            { id: '0', label: '20 + 12 = 32', value: '20+12=32' },
            { id: '1', label: '32 + 20 = 52', value: '32+20=52' },
            { id: '2', label: '12 − 20 = -8', value: '12-20=-8' },
            { id: '3', label: '32 ÷ 20 = 1.6', value: '32/20=1.6' },
          ],
          hintText: 'אם 32 − 20 = 12, הבדיקה היא להחזיר: 20 + 12 = ?',
        },
      ],
    },
  ],
}

// ─── Exported Map ─────────────────────────────────────────────────────────────

export const LEARN_CONTENT: Partial<Record<TopicId, TopicLearnContent>> = {
  addition,
  subtraction,
  multiplication,
  division,
  fractions,
  decimals,
  percentages,
  geometry,
  wordProblems,
}
