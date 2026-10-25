import Loading from "../components/Loading";
import PostList from "../components/PostList";
import { useFetch } from "../hooks/useFetch";
import { type PostsBySection, writing } from "../lib/posts";

export default function Writing() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  return (
    <>
      <h1 className="page-title">Writing</h1>
      {loading ? <Loading /> : <PostList posts={writing(data)} />}
    </>
  );
}
