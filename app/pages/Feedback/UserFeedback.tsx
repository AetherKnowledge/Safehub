import StarRating from "@/app/components/StarRating";
import UserImage from "@/app/components/UserImage";
import { User } from "@/app/generated/prisma";
import { formatDateDisplay } from "@/lib/utils";
import { FeedbackWithStudentDetails } from "./FeedbackActions";

const UserFeedback = ({
  feedback,
}: {
  feedback: FeedbackWithStudentDetails;
}) => {
  return (
    <div className="card w-96 h-80 bg-base-100 card-sm shadow-lg pt-2">
      <div className="card-body items-center justify-center">
        <StarRating rating={feedback.rating} size={30} className="gap-2" />
        <div className="flex items-center justify-center px-4 py-2 overflow-y-auto h-32">
          <p className="text-center">{feedback.content}</p>
        </div>
        <div className="justify-end card-actions">
          {feedback.appointment.student ? (
            <UserInfo
              user={feedback.appointment.student.user}
              date={feedback.createdAt}
            />
          ) : (
            <AnonymousUserInfo date={feedback.createdAt} />
          )}
        </div>
      </div>
    </div>
  );
};

const AnonymousUserInfo = ({ date }: { date: Date }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <UserImage src={undefined} name="?" width={10} />
      <p className="text-bold mt-1">Anonymous</p>
      <p className="text-[11px] text-base-content/70">
        {formatDateDisplay(date)}
      </p>
    </div>
  );
};

const UserInfo = ({
  user,
  date,
}: {
  user: Pick<User, "id" | "name" | "image" | "email">;
  date: Date;
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <UserImage
        src={user.image}
        name={user.name || user.email.split("@")[0]}
        width={10}
      />
      <p className="text-bold">{user.name}</p>
      <p className="text-[11px] text-base-content/70">
        {formatDateDisplay(date)}
      </p>
    </div>
  );
};

export default UserFeedback;
