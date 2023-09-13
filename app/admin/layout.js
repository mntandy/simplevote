import { getAuthSession } from "../lib/server/authSession"

export default async function Layout({ dashboard, login }) {
  const session = await getAuthSession()
  return session ? dashboard : login
}