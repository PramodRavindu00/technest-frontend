import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'


const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div>
        <SidebarProvider>
  <Sidebar/>
  <main>
      <SidebarTrigger className="hover:cursor-pointer ml-2"/>
      {children}
    </main>
  </SidebarProvider>
    </div>
  )
}

export default Layout