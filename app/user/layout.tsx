import StudentLayout from "@/app/components/Student/Layout";

interface Props {
  children?: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <StudentLayout>{children}</StudentLayout>;
};

export default Layout;
