
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
     
      <div className="flex flex-col flex-1">
    
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
   
      </div>
    </div>
  )
}