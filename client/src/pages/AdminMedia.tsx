/**
 * Ancien /admin/media — la médiathèque est désormais /admin-v2
 * (refonte « fond + emplacements »). On redirige pour les anciens liens/marque-pages.
 */
import { Redirect } from "wouter";

export default function AdminMedia() {
  return <Redirect to="/admin-v2" />;
}
