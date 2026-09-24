import { esc } from './html.mjs';
export const pageHeading = (title, extra = '') => `<header class="v-page-heading"><h1>${esc(title)}</h1>${extra}</header>`;
