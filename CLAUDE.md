# CLAUDE.md

## Dev Server

- 로컬 dev 서버는 항상 **http://localhost:5173** 포트를 사용한다 (`strictPort: true` 설정됨)
- 네이버 지도 API 서비스 URL에 `http://localhost:5173`이 등록되어 있으므로 포트를 변경하면 안 된다

## 이미지 최적화

새 이미지를 `public/`에 추가할 때 반드시 아래 순서로 최적화 후 배포한다.

1. **리사이즈** — 가로 1200px 초과 시 축소 (비율 유지)
   ```bash
   sips --resampleWidth 1200 <파일>
   ```
2. **WebP 변환** — quality 80으로 변환
   ```bash
   cwebp -q 80 <파일> -o <파일명>.webp
   ```
3. **원본 삭제** — 변환 완료 후 jpg/jpeg/png 원본 제거
4. **코드 참조 수정** — config.ts, Gallery.tsx, Share.tsx, index.html 등에서 확장자를 `.webp`로 변경
5. **배포** — 커밋 후 push
