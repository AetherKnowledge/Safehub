import Divider from "../../Divider";
import { getPosts } from "../../Posts/PostActions";
import EventBox from "../../Posts/PostBox";

const Dashboard = async () => {
  const posts = await getPosts();

  return (
    <div className="max-w-2xl">
      <div className="bg-base-100 shadow-br rounded-xl">
        {posts.map((post) => (
          <div key={post.id}>
            <EventBox {...post} />
            {post.id !== posts[posts.length - 1].id && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
