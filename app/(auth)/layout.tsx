export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container">
      {children} 
      {/* O Header não está aqui, então ele não aparece! */}
    </div>
  );
}