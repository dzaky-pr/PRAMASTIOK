import Navbar from '@/layouts/Navbar';

type MainLayoutProps = {
  children: React.ReactNode;
  withNavbar?: boolean;
  withDropdown?: boolean;
  withBackButton?: boolean;
  withRightNav?: boolean;
  withTitle?: boolean;
  title?: string;
  className?: string;
  role?: string;
};

export default function MainLayout({
  children,
  withNavbar = false,
  withDropdown = false,
  withBackButton = false,
  withRightNav = false,
  withTitle = false,
  className,
  title,

  ...props
}: MainLayoutProps) {
  return (
    <div
      className={`scrollbar scrollbar-thin overflow-hidden ${className}`}
      {...props}
    >
      {withNavbar && (
        <Navbar
          withTitle={withTitle}
          withRightNav={withRightNav}
          title={title}
          withDropdown={withDropdown}
          withBackButton={withBackButton}
        />
      )}

      {children}
    </div>
  );
}
