import Loading from "../components/Loading";
import PostList from "../components/PostList";
import { useFetch } from "../hooks/useFetch";
import type { PostsBySection } from "../lib/posts";

export default function Projects() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  return (
    <>
      <h1 className="page-title">Projects</h1>
      {loading ? <Loading /> : <PostList posts={data?.projects ?? []} />}
    </>
  );
}
