import FormBG from "@/app/components/Forms/FormBG";
import FormComponentBG from "@/app/components/Forms/FormComponentBG";

const FormsLoading = () => {
  return (
    <>
      <FormBG>
        <FormComponentBG className="h-30" skeleton />
        <FormComponentBG skeleton />
        <FormComponentBG className="h-40" skeleton />
        <FormComponentBG skeleton />
        <FormComponentBG className="h-50" skeleton />
        <FormComponentBG skeleton />
        <FormComponentBG skeleton />
      </FormBG>
    </>
  );
};

export default FormsLoading;
