"use server"

import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action"
import { Description } from "@radix-ui/react-dialog";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({params} : {params: {username: string}}) {
  const user = await getProfileByUsername(params.username)
  if (!user) notFound();

  return {
    title: `${user.name ?? user.username}`,
    Description: user.bio || `Checkout ${user.username}'s profile.`
  }

}

async function ProfilePageServer({params} : {params: {username: string}}) {

  const user = await getProfileByUsername(params.username);
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id)
  ])

  return (
    <ProfilePageClient 
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}

    />
  )
}

export default ProfilePageServer
