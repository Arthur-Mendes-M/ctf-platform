import type { Metadata } from "next";
import "../globals.css";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { getUserSession } from "@/utils/cookies";
// import { Toaster } from "@/components/ui/sonner";
import FirstInventorySelector from "@/components/first-inventory";
import { ROLES } from "@/utils/types/user";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { QuickActions } from "@/components/sidebar/quick-actions";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "CTF Arena",
  description: "The best academic capture the flag experience. Play and learn with your friends!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionContext = await getUserSession();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  if (
    sessionContext.user.first_access &&
    sessionContext.user.role !== ROLES.ADMIN
  ) {
    return <FirstInventorySelector />;
  }

  return (
    // <main className="min-h-screen bg-primary-foreground flex">
    //   {/* <Header user={user} /> */}
    //   <Sidebar user={user} />

    //   <div className="container mx-auto px-4 py-8 flex flex-col gap-5">
    //     {children}
    //   </div>
    //   {/*
    //   <Toaster position="top-right" richColors /> */}
    // </main>

    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={sessionContext.user} />
      <SidebarInset>
        <header className="fixed bottom-0 left-0 max-w-full md:relative z-40 w-full bg-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex justify-end md:justify-start w-full mx-4 items-center gap-2 md:border-b h-10">
            <SidebarTrigger className="-ml-1 order-3 md:order-none" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 order-2 md:order-none"
            />
            <QuickActions user={sessionContext.user} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 m-4 md:mt-2">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
