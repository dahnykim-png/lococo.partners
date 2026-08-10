import { handleSaveToken } from '../save-token-core.js';

export async function onRequestPost(context) {
  return handleSaveToken(context);
}

export async function onRequestOptions(context) {
  return handleSaveToken(context);
}
