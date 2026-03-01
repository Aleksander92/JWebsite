class LanguageConverter {
  static hiraganaToEnglish(hieroglyph) {
    for (const item of alphabet) {
      if (item[0] === hieroglyph) {
        return item[1];
      }
    }
    throw new Error('No such hieroglyph: ' + hieroglyph);
  }

  static anythingToEnglish(s) {
    if (s[0] >= 'a' && s[0] <= 'z') {
      return s;
    }
    return LanguageConverter.hiraganaToEnglish(s);
  }
}
