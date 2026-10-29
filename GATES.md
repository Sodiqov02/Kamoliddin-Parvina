# Gates: Golden Romance

Scope: Preserve the existing React invitation while delivering the supplied portrait, paper envelope, accurate Uzbek wedding details, calendar export and responsive accessible navigation.

- [x] G1: Wedding data, calendar export and obsolete-content checks pass
  CHECK: node --experimental-strip-types --test tests/wedding.test.mjs
  EXPECT: /ℹ fail 0/
  EVIDENCE: automatic-evidence=v1; definition-sha256=7a73757414dc307326c53c4db5a6a6713245e3241126ea7ade755127318d2380; exit=0; EXPECT=matched; output-sha256=2ed5e16bb10f3aacb5283b9042ebf987180f015aa846b02caac92c801fa3c0fc; output-bytes=520; shell=C:\WINDOWS\system32\cmd.exe; cwd=Z:\projects\kamoliddin parvina; path=66a0444326ec/22 entries

- [x] G2: Source passes ESLint and TypeScript
  CHECK: node scripts/check-source.mjs
  EXPECT: SOURCE_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=5846e50c1e67a7fb44b42ea48a1ad9dcf5047d0dec28606b189f879e87b104a6; exit=0; EXPECT=matched; output-sha256=72010e796bce616a81e648746814d6ab072b11a2cb46557c33381221ebc71c89; output-bytes=10; shell=C:\WINDOWS\system32\cmd.exe; cwd=Z:\projects\kamoliddin parvina; path=66a0444326ec/22 entries

- [x] G3: Production build includes invitation and public assets
  CHECK: node scripts/check-build.mjs
  EXPECT: BUILD_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=0b4386facc435ec0ef452525ad1b3a5cbcefb0d8220a1df8744f07d38c267504; exit=0; EXPECT=matched; output-sha256=be7a854d4ad5784117cee3fd50a17e85d86e319e697eefc475e6b397b6fa1aca; output-bytes=18938; shell=C:\WINDOWS\system32\cmd.exe; cwd=Z:\projects\kamoliddin parvina; path=66a0444326ec/22 entries

- [x] G4: Browser checks cover envelope, keyboard, guest input, image, metadata, calendar, all requested widths and reduced motion
  CHECK: node scripts/verify-browser.mjs
  EXPECT: BROWSER_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=c08bdc4da0e347b0e36a98dcf2021c2bfb5a8a489420029f48fa623c64009383; exit=0; EXPECT=matched; output-sha256=585d0e58b4c5baedf575f6350f595791a63e5a298b42d3c4e01adf091d1ff5c5; output-bytes=882; shell=C:\WINDOWS\system32\cmd.exe; cwd=Z:\projects\kamoliddin parvina; path=66a0444326ec/22 entries

- [x] G5: Final desktop and mobile screenshots reviewed; real-device and field-performance limitations documented
  EVIDENCE: Reviewed final inspector desktop, tablet and mobile fold/contact sheets plus portrait, OG and 320px/1440px story screenshots. IMPLEMENTATION.md records critique, fixes, measured lab metrics, real-device/INP limitations and remaining tooling audit findings.

- [x] G6: Prepared GitHub Pages subdirectory loads scripts, fonts, photo and guest interaction
  CHECK: node scripts/verify-pages.mjs
  EXPECT: PAGES_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=9127c2300c13b5d826e46981e2fa8ba64495dab5145caefe9e17dbb939bc05ba; exit=0; EXPECT=matched; output-sha256=40c690e537b6ba404f6710df31e98202e11a4357e60bed466cbf660ef5fc6aee; output-bytes=9; shell=C:\WINDOWS\system32\cmd.exe; cwd=Z:\projects\kamoliddin parvina; path=66a0444326ec/22 entries
