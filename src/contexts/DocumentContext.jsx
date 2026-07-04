import React, { createContext, useContext, useState } from 'react';

const DocumentContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

// Mock data to simulate Gemma's analysis response
const MOCK_ANALYSIS_DATA = {
  documentType: 'Aadhaar Address Update Consent Form',
  simplifiedText: 'This document is a formal permission slip (Consent Form) that allows you to update your home address on your Aadhaar card using a family member\'s Aadhaar details. If you do not have a valid address proof of your own (like a utility bill or rent agreement), you can use this form. A close family member (like your father, mother, husband, wife, or guardian) who lives at the new address must sign this form. By signing, they officially confirm that you live with them and agree to share their address credentials on your Aadhaar card. This form is legally binding, meaning any false statement can lead to legal penalties.',
  translations: {
    en: 'This document is a formal permission slip (Consent Form) that allows you to update your home address on your Aadhaar card using a family member\'s Aadhaar details. If you do not have a valid address proof of your own (like a utility bill or rent agreement), you can use this form. A close family member (like your father, mother, husband, wife, or guardian) who lives at the new address must sign this form. By signing, they officially confirm that you live with them and agree to share their address credentials on your Aadhaar card. This form is legally binding, meaning any false statement can lead to legal penalties.',
    hi: 'यह दस्तावेज़ एक औपचारिक सहमति पत्र (Consent Form) है जो आपको परिवार के किसी सदस्य के आधार विवरण का उपयोग करके अपने आधार कार्ड पर अपने घर का पता अपडेट करने की अनुमति देता है। यदि आपके पास स्वयं का कोई वैध पता प्रमाण (जैसे बिजली का बिल या किराया समझौता) नहीं है, तो आप इस फॉर्म का उपयोग कर सकते हैं। एक करीबी पारिवारिक सदस्य (जैसे आपके पिता, माता, पति, पत्नी, या अभिभावक) जो नए पते पर रहते हैं, उन्हें इस फॉर्म पर हस्ताक्षर करना होगा। हस्ताक्षर करके, वे आधिकारिक तौर पर पुष्टि करते हैं कि आप उनके साथ रहते हैं और आपके आधार कार्ड पर अपने पते के विवरण साझा करने के लिए सहमत हैं। यह फॉर्म कानूनी रूप से बाध्यकारी है, जिसका अर्थ है कि कोई भी गलत बयान कानूनी दंड का कारण बन सकता है।',
    bn: 'এই নথিটি একটি আনুষ্ঠানিক সম্মতি পত্র (Consent Form) যা আপনাকে পরিবারের কোনো সদস্যের আধার বিবরণ ব্যবহার করে আপনার আধার কার্ডে আপনার বাড়ির ঠিকানা আপডেট করতে দেয়। আপনার নিজের কোনো বৈধ ঠিকানার প্রমাণ (যেমন বিদ্যুৎ বিল বা ভাড়ার চুক্তি) না থাকলে আপনি এই ফর্মটি ব্যবহার করতে পারেন। একজন ঘনিষ্ঠ পরিবারের সদস্য (যেমন আপনার বাবা, মা, স্বামী, স্ত্রী বা অভিভাবক) যিনি নতুন ঠিকানায় থাকেন, তাকে এই ফর্মে স্বাক্ষর করতে হবে। স্বাক্ষর করার মাধ্যমে, তারা আনুষ্ঠানিকভাবে নিশ্চিত করেন যে আপনি তাদের সাথে থাকেন এবং আপনার আধার কার্ডে তাদের ঠিকানার তথ্য ভাগ করতে সম্মত হন। এই ফর্মটি আইনত বাধ্যতামূলক, যার অর্থ কোনো মিথ্যা বিবৃতি দিলে আইনি জরিমানা হতে পারে।',
    mr: 'हा दस्तऐवज एक औपचारिक संमती पत्र (Consent Form) आहे जो तुम्हाला कुटुंबातील सदस्याच्या आधार तपशीलाचा वापर करून तुमच्या आधार कार्डवरील तुमच्या घरचा पत्ता अपडेट करण्याची परवानगी देतो. तुमच्याकडे स्वतःचा कोणताही वैध पत्त्याचा पुरावा (जसे की वीज बिल किंवा भाडे करार) नसल्यास, तुम्ही हा फॉर्म वापरू शकता. नवीन पत्त्यावर राहणाऱ्या कुटुंबातील जवळच्या सदस्याने (जसे की तुमचे वडील, आई, पती, पत्नी किंवा पालक) या फॉर्मवर स्वाक्षरी करणे आवश्यक आहे. स्वाक्षरी करून, ते अधिकृतपणे पुष्टी करतात की तुम्ही त्यांच्यासोबत राहता आणि तुमच्या आधार कार्डवर त्यांच्या पत्त्याची माहिती सामायिक करण्यास सहमती देतात. हा फॉर्म कायदेशीररित्या बंधनकारक आहे, म्हणजेच कोणताही खोटा दावा केल्यास कायदेशीर दंड होऊ शकतो.',
    te: 'ఈ పత్రం ఒక అధికారిక సమ్మతి పత్రం (Consent Form), ఇది కుటుంబ సభ్యుల ఆధార్ వివరాలను ఉపయోగించి మీ ఆధార్ కార్డ్‌లో మీ ఇంటి చిరునామాను అప్‌డేట్ చేయడానికి అనుమతిస్తుంది. మీ స్వంత చెల్లుబాటు అయ్యే చిరునామా రుజువు (కరెంట్ బిల్లు లేదా అద్దె ఒప్పందం వంటివి) లేనట్లయితే, మీరు ఈ ఫారమ్‌ను ఉపయోగించవచ్చు. కొత్త చిరునామాలో నివసిస్తున్న దగ్గరి కుటుంబ సభ్యుడు (తండ్రి, తల్లి, భర్త, భార్య లేదా సంరక్షకుడు వంటివారు) తప్పనిసరిగా ఈ ఫారమ్‌పై సంతకం చేయాలి. సంతకం చేయడం ద్వారా, వారు మీతో కలిసి నివసిస్తున్నారని అధికారికంగా ధృవీకరిస్తారు మరియు మీ ఆధార్ కార్డ్‌లో వారి చిరునామా వివరాలను పంచుకోవడానికి అంగీకరిస్తారు. ఈ ఫారమ్ చట్టబద్ధంగా కట్టుబడి ఉంటుంది, అంటే ఏదైనా తప్పుడు ప్రకటన చట్టపరమైన జరిమానాలకు దారి తీస్తుంది.',
    ta: 'இந்த ஆவணம் ஒரு முறையான ஒப்புதல் படிவமாகும் (Consent Form), இது குடும்ப உறுப்பினரின் ஆதார் விவரங்களைப் பயன்படுத்தி உங்கள் ஆதார் அட்டையில் உங்கள் வீட்டு முகவரியைப் புதுப்பிக்க அனுமதிக்கிறது. உங்களிடம் சொந்தமாகச் செல்லுபடியாகும் முகவரிச் சான்று (மின்சாரக் கட்டணம் அல்லது வாடகை ஒப்பந்தம் போன்றவை) இல்லை என்றால், இந்தப் படிவத்தைப் பயன்படுத்தலாம். புதிய முகவரியில் வசிக்கும் நெருங்கிய குடும்ப உறுப்பினர் (தந்தை, தாய், கணவர், மனைவி அல்லது பாதுகாவலர்) இந்தப் படிவத்தில் கையொப்பமிட வேண்டும். கையொப்பமிடுவதன் மூலம், நீங்கள் அவர்களுடன் வசிப்பதை அவர்கள் அதிகாரப்பூர்வமாக உறுதிப்படுத்துகிறார்கள் மற்றும் உங்கள் ஆதார் அட்டையில் அவர்களின் முகவரி விவரங்களைப் பகிர ஒப்புக்கொள்கிறார்கள். இந்தப் படிவம் சட்டப்பூர்வமாகக் கட்டுப்படுத்தக்கூடியது, அதாவது எந்தவொரு தவறான அறிக்கையும் சட்டப்பூர்வ அபராதங்களுக்கு வழிவகுக்கும்.',
    gu: 'આ દસ્તાવેજ એક ઔપચારિક સંમતિ પત્રક (Consent Form) છે જે તમને પરિવારના સભ્યની આધાર વિગતોનો ઉપયોગ કરીને તમારા આધાર કાર્ડ પર તમારા ઘરનું સરનામું અપડેટ કરવાની મંજૂરી આપે છે. જો તમારી પાસે તમારું પોતાનું કોઈ માન્ય સરનામાનું પ્રમાણ (જેમ કે વીજળીનું બિલ અથવા ભાડા કરાર) ન હોય, તો તમે આ પત્રકનો ઉપયોગ કરી શકો છો. નવા સરનામે રહેતા પરિવારના નજીકના સભ્ય (જેમ કે તમારા પિતા, માતા, પતિ, પત્ની અથવા વાલી) એ આ પત્રક પર સહી કરવી આવશ્યક છે. સહી કરીને, તેઓ સત્તાવાર રીતે પુષ્ટિ કરે છે કે તમે તેમની સાથે રહો છો અને તમારા આધાર કાર્ડ પર તેમના સરનામાની વિગતો શેર કરવા માટે સંમત છે. આ ફોર્મ કાનૂની રીતે બંધનકર્તા છે, એટલે કે કોઈપણ ખોટું નિવેદન કાનૂની દંડ તરફ દોરી શકે છે.',
    ur: 'یہ دستاویز ایک باضابطہ رضامندی کا فارم (Consent Form) ہے جو آپ کو خاندان کے کسی فرد کے آدھار کی تفصیلات کا استعمال کرتے ہوئے اپنے آدھار کارڈ پر اپنے گھر کا پتہ اپ ڈیٹ کرنے کی اجازت دیتا ہے۔ اگر آپ کے پاس اپنے پتے کا کوئی معتبر ثبوت (جیسے بجلی کا بل یا کرایہ نامہ) نہیں ہے، تو آپ یہ فارم استعمال کر سکتے ہیں۔ خاندان کا کوئی قریبی فرد (جیسے والد، والدہ، شوہر، بیوی، یا سرپرست) جو نئے پتے پر رہتا ہے، اس فارم پر دستخط کرنا ضروری ہے۔ دستخط کر کے، وہ سرکاری طور پر تصدیق کرتے ہیں کہ آپ ان کے ساتھ رہتے ہیں اور اپنے آدھار کارڈ پر اپنے پتے کی تفصیلات شیئر کرنے پر اتفاق کرتے ہیں۔ یہ فارم قانونی طور پر پابند ہے، یعنی کسی بھی غلط بیان کے نتیجے میں قانونی سزا ہو سکتی ہے۔',
    kn: 'ಈ ದಾಖಲೆಯು ಒಂದು ಔಪಚಾರಿಕ ಒಪ್ಪಿಗೆ ಪತ್ರವಾಗಿದ್ದು (Consent Form), ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರ ಆಧಾರ್ ವಿವರಗಳನ್ನು ಬಳಸಿಕೊಂಡು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಮನೆಯ ವಿಳಾಸವನ್ನು ನವೀಕರಿಸಲು ನಿಮಗೆ ಅನುಮತಿಸುತ್ತದೆ. ನಿಮ್ಮ ಸ್ವಂತ ಯಾವುದೇ ಮಾನ್ಯ ವಿಳಾಸ ಪುರಾವೆಗಳು (ವಿದ್ಯುತ್ ಬಿಲ್ ಅಥವಾ ಬಾಡಿಗೆ ಒಪ್ಪಂದದಂತಹವು) ಇಲ್ಲದಿದ್ದರೆ, ನೀವು ಈ ಫಾರ್ಮ್ ಅನ್ನು ಬಳಸಬಹುದು. ಹೊಸ ವಿಳಾಸದಲ್ಲಿ ವಾಸಿಸುವ ನಿಕಟ ಕುಟುಂಬದ ಸದಸ್ಯರು (ತಂದೆ, ತಾಯಿ, ಪತಿ, ಪತ್ನಿ ಅಥವಾ ಪೋಷಕರು) ಈ ಫಾರ್ಮ್‌ಗೆ ಕಡ್ಡಾಯವಾಗಿ ಸಹಿ ಮಾಡಬೇಕು. ಸಹಿ ಮಾಡುವ ಮೂಲಕ, ಅವರು ನೀವು ಅವರೊಂದಿಗೆ ವಾಸಿಸುತ್ತಿರುವುದನ್ನು ಅಧಿಕೃತವಾಗಿ ದೃಢೀಕರಿಸುತ್ತಾರೆ ಮತ್ತು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನಲ್ಲಿ ತಮ್ಮ ವಿಳಾಸದ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಒಪ್ಪುತ್ತಾರೆ. ಈ ಫಾರ್ಮ್ ಕಾನೂನುಬದ್ಧವಾಗಿ ಬದ್ಧವಾಗಿದೆ, ಅಂದರೆ ಯಾವುದೇ ತಪ್ಪು ಹೇಳಿಕೆಯು ಕಾನೂನು ದಂಡಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು.',
    or: 'ଏହି ଦଲିଲ ହେଉଛି ଏକ ଆନୁଷ୍ଠାନିକ ସମ୍ମତି ପତ୍ର (Consent Form) ଯାହା ଆପଣଙ୍କୁ ପରିବାରର ଜଣେ ସଦସ୍ୟଙ୍କ ଆଧାର ବିବରଣୀ ବ୍ୟବହାର କରି ଆପଣଙ୍କ ଆଧାର କାର୍ଡରେ ଆପଣଙ୍କ ଘରର ଠିକଣା ଅପଡେଟ୍ କରିବାକୁ ଅନୁମତି ଦିଏ। ଯଦି ଆପଣଙ୍କର ନିଜର କୌଣସି ବୈଧ ଠିକଣା ପ୍ରମାଣ (ଯେପରିକି ବିଜୁଳି ବିଲ୍ କିମ୍ବା ଭଡ଼ା ଚୁକ୍ତି) ନାହିଁ, ତେବେ ଆପଣ ଏହି ଫର୍ମ ବ୍ୟବହାର କରିପାରିବେ। ନୂତନ ଠିକଣାରେ ରହୁଥିବା ଜଣେ ନିକଟତର ପରିବାର ସଦସ୍ୟ (ଯେପରିକି ଆପଣଙ୍କର ପିତା, ମାତା, ସ୍ୱାମୀ, ସ୍ତ୍ରୀ କିମ୍ବା ଅଭିଭାବକ) ଏହି ଫର୍ମରେ ସ୍ୱାକ୍ଷର କରିବା ଆବଶ୍ୟକ। ସ୍ୱାକ୍ଷର କରି ସେମାନେ ଆନୁଷ୍ଠାନିକ ଭାବରେ ନିଶ୍ଚିତ କରନ୍ତି ଯେ ଆପଣ ସେମାନଙ୍କ ସହ ରହୁଛନ୍ତି ଏବଂ ଆପଣଙ୍କ ଆଧାର କାର୍ଡରେ ସେମାନଙ୍କର ଠିକଣା ବିବରଣୀ ସେୟାର କରିବାକୁ ସମ୍ମତ ଅଟନ୍ତି। ଏହି ଫର୍ମ ଆଇନଗତ ଭାବେ ବାଧ୍ୟତାମୂଳକ, ଯାହାର ଅର୍ଥ ହେଉଛି କୌଣସି ଭୁଲ୍ ବିବରଣୀ ଆଇନଗତ ଦଣ୍ଡର କାରଣ ହୋଇପାରେ।',
    ml: 'നിങ്ങളുടെ സ്വന്തം വിലാസ തെളിവ് (വൈദ്യുതി ബില്ല് അല്ലെങ്കിൽ വാടക കരാർ പോലുള്ളവ) ഇല്ലെങ്കിൽ, കുടുംബാംഗത്തിന്റെ ആധാർ വിവരങ്ങൾ ഉപയോഗിച്ച് നിങ്ങളുടെ ആധാർ കാർഡിലെ വിലാസം പുതുക്കാൻ അനുവദിക്കുന്ന ഒരു സമ്മതപത്രമാണിത് (Consent Form). പുതിയ വിലാസത്തിൽ താമസിക്കുന്ന അടുത്ത കുടുംബാംഗം (അച്ഛൻ, അമ്മ, ഭർത്താവ്, ഭാര്യ അല്ലെങ്കിൽ രക്ഷിതാവ്) ഈ ഫോമിൽ ഒപ്പിടണം. ഒപ്പിടുന്നതിലൂടെ, നിങ്ങൾ അവരുടെ കൂടെയാണ് താമസിക്കുന്നതെന്ന് അവർ ഔദ്യോഗികമായി സ്ഥിരീകരിക്കുകയും അവരുടെ വിലാസ വിവരങ്ങൾ നിങ്ങളുമായി പങ്കിടാൻ സമ്മതിക്കുകയും ചെയ്യുന്നു. ഈ ഫോം നിയമപരമായി ബാധ്യതയുള്ളതാണ്, അതിനാൽ തെറ്റായ വിവരങ്ങൾ നൽകുന്നത് നിയമപരമായ ശിക്ഷകൾക്ക് കാരണമാകാം.',
    pa: "ਇਹ ਦਸਤਾਵੇਜ਼ ਇੱਕ ਰਸਮੀ ਸਹਿਮਤੀ ਪੱਤਰ (Consent Form) ਹੈ ਜੋ ਤੁਹਾਨੂੰ ਪਰਿਵਾਰ ਦੇ ਕਿਸੇ ਮੈਂਬਰ ਦੇ ਆਧਾਰ ਵੇਰਵਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਆਪਣੇ ਆਧਾਰ ਕਾਰਡ 'ਤੇ ਆਪਣੇ ਘਰ ਦਾ ਪਤਾ ਅੱਪਡੇਟ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ। ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਲ ਆਪਣਾ ਕੋਈ ਵੈਧ ਪਤਾ ਸਬੂਤ (ਜਿਵੇਂ ਕਿ ਬਿਜਲੀ ਦਾ ਬਿੱਲ ਜਾਂ ਕਿਰਾਇਆ ਇਕਰਾਰਨਾਮਾ) ਨਹੀਂ ਹੈ, ਤਾਂ ਤੁਸੀਂ ਇਸ ਫਾਰਮ ਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹੋ। ਨਵੇਂ ਪਤੇ 'ਤੇ ਰਹਿਣ ਵਾਲੇ ਪਰਿਵਾਰ ਦੇ ਕਿਸੇ ਨਜ਼ਦੀਕੀ ਮੈਂਬਰ (ਜਿਵੇਂ ਕਿ ਤੁਹਾਡੇ ਪਿਤਾ, ਮਾਤਾ, ਪਤੀ, ਪਤਨੀ, ਜਾਂ ਸਰਪ੍ਰਸਤ) ਨੂੰ ਇਸ ਫਾਰਮ 'ਤੇ ਦਸਤਖਤ ਕਰਨੇ ਪੈਣਗੇ। ਦਸਤਖਤ ਕਰਕੇ, ਉਹ ਅਧਿਕਾਰਤ ਤੌਰ 'ਤੇ ਪੁਸ਼ਟੀ ਕਰਦੇ ਹਨ ਕਿ ਤੁਸੀਂ ਉਨ੍ਹਾਂ ਦੇ ਨਾਲ ਰਹਿੰਦੇ ਹੋ ਅਤੇ ਤੁਹਾਡੇ ਆਧਾਰ ਕਾਰਡ 'ਤੇ ਆਪਣੇ ਪਤੇ ਦੇ ਵੇਰਵੇ ਸਾਂਝੇ ਕਰਨ ਲਈ ਸਹਿਮਤ ਹਨ। ਇਹ ਫਾਰਮ ਕਾਨੂੰਨੀ ਤੌਰ 'ਤੇ ਪਾਬੰਦ ਹੈ, ਭਾਵ ਕੋਈ ਵੀ ਗਲਤ ਬਿਆਨ ਕਾਨੂੰਨੀ ਜ਼ੁਰਮਾਨੇ ਦਾ ਕਾਰਨ ਬਣ ਸਕਦਾ ਹੈ।"
  },
  deadlines: [
    {
      id: 'd1',
      action: 'Submit signed Consent Form to Aadhaar Seva Kendra / Online Portal',
      date: 'Within 30 days of signing',
      daysLeft: 30,
      priority: 'high',
      completed: false
    },
    {
      id: 'd2',
      action: 'Verify mobile OTP on family member\'s registered Aadhaar phone number',
      date: 'Within 10 minutes of submitting online request',
      daysLeft: 1,
      priority: 'high',
      completed: false
    },
    {
      id: 'd3',
      action: 'Pay the Aadhaar address update fee of ₹50 online or at the center',
      date: 'At the time of submission',
      daysLeft: 30,
      priority: 'medium',
      completed: false
    }
  ],
  requiredDocs: [
    {
      id: 'rd1',
      name: 'Original UIDAI Self-Declaration / Consent Form',
      purpose: 'Must be filled and signed by the Head of Family (HoF).',
      status: 'needed'
    },
    {
      id: 'rd2',
      name: 'Identity proof of the Head of Family (HoF)',
      purpose: 'Aadhaar Card of the family member who is sharing their address.',
      status: 'needed'
    },
    {
      id: 'rd3',
      name: 'Proof of Relationship Document (PoR)',
      purpose: 'Ration card, Birth certificate, Marriage certificate, or Passport showing relationship. (If not available, HoF has to declare relationship in this self-declaration form).',
      status: 'needed'
    }
  ],
  actionPlan: [
    {
      step: 1,
      title: 'Download and Print the Form',
      description: 'Download the official Self-Declaration / Consent form from UIDAI website and print it out clearly on A4 size paper.',
      checklist: ['Printed clean copy', 'Used black or blue ballpoint pen']
    },
    {
      step: 2,
      title: 'Fill Head of Family (HoF) Details',
      description: 'The family member whose address you are using must enter their name, Aadhaar card number, and current full address exactly as printed on their Aadhaar card.',
      checklist: ['HoF Name matched with Aadhaar', 'HoF Aadhaar number entered correctly']
    },
    {
      step: 3,
      title: 'Fill Applicant Details',
      description: 'Enter your own details (the resident requesting address update), including your name and Aadhaar number.',
      checklist: ['Applicant name matches Aadhaar', 'Applicant Aadhaar number checked']
    },
    {
      step: 4,
      title: 'Sign and Date the Document',
      description: 'The Head of Family must sign the document in the dedicated signature box. Enter the current date and city name.',
      checklist: ['HoF signed inside the box', 'Date and location written']
    },
    {
      step: 5,
      title: 'Submit Online or Visit Aadhaar Kendra',
      description: 'Upload the scanned signed PDF online via myAadhaar portal (paying ₹50) OR take the physical copy along with your family member to a local Aadhaar Seva Kendra.',
      checklist: ['Scanned PDF size is under 2MB (if online)', 'Aadhaar update fee ₹50 paid']
    }
  ],
  importantInfo: [
    "**Head of Family Signature is Mandatory**: The document is invalid unless signed by the Head of Family (HoF) whose address you are using.",
    "**Legal Penalties for False Info**: Providing false address declarations is a punishable offense under Section 33 & 34 of the Aadhaar Act, carrying up to 3 years imprisonment or a ₹10,000 fine.",
    "**Valid for 3 Months**: Once signed, this declaration form must be submitted within 3 months, or it will expire.",
    "**Relationship Proof Needed**: Along with this form, you must show a Proof of Relationship (PoR) document. If no document exists, the HoF must declare it directly within this form."
  ]
};

export const DocumentProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState('en');

  const uploadDocument = (file) => {
    if (!file) return;
    setUploadedFile(file);
    setFileName(file.name);
    
    // Format size
    const sizeInMB = file.size / (1024 * 1024);
    setFileSize(sizeInMB > 0.1 ? `${sizeInMB.toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`);
    
    // Clear previous results upon new upload
    setAnalysisResult(null);
  };

  const processDocument = () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);

    // Simulate 2.5 seconds network/processing delay for hackathon UX
    setTimeout(() => {
      setAnalysisResult(MOCK_ANALYSIS_DATA);
      setIsAnalyzing(false);
    }, 2500);
  };

  const toggleDocCheck = (id) => {
    if (!analysisResult) return;
    const updatedDocs = analysisResult.requiredDocs.map(doc => 
      doc.id === id ? { ...doc, status: doc.status === 'have' ? 'needed' : 'have' } : doc
    );
    setAnalysisResult({
      ...analysisResult,
      requiredDocs: updatedDocs
    });
  };

  const toggleDeadlineCheck = (id) => {
    if (!analysisResult) return;
    const updatedDeadlines = analysisResult.deadlines.map(dl => 
      dl.id === id ? { ...dl, completed: !dl.completed } : dl
    );
    setAnalysisResult({
      ...analysisResult,
      deadlines: updatedDeadlines
    });
  };

  const resetState = () => {
    setUploadedFile(null);
    setFileName('');
    setFileSize('');
    setIsAnalyzing(false);
    setAnalysisResult(null);
    setActiveLanguage('en');
  };

  return (
    <DocumentContext.Provider value={{
      uploadedFile,
      fileName,
      fileSize,
      isAnalyzing,
      analysisResult,
      activeLanguage,
      setActiveLanguage,
      uploadDocument,
      processDocument,
      toggleDocCheck,
      toggleDeadlineCheck,
      resetState
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
