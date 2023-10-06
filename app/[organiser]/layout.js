import OrganiserLayout from '@/app/components/OrganiserLayout'

export default function Layout({ params, children }) {
  return (
    <OrganiserLayout organiser={params.organiser}>
        {children}
    </OrganiserLayout>
  )
}      