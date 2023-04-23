import { uid } from 'uid';

export default function generateId(): string {
  return 'custom_' + uid();
}
