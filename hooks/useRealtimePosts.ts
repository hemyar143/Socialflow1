import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function useRealtimePosts() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error('Fetch error:', error)
      else setPosts(data)
    }

    fetchPosts()

    const channel = supabase
      .channel('realtime-posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('Realtime change received:', payload)
          const newPost = payload.new
          const oldPost = payload.old

          setPosts((current) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [newPost, ...current]
              case 'UPDATE':
                return current.map((post) =>
                  post.id === newPost.id ? newPost : post
                )
              case 'DELETE':
                return current.filter((post) => post.id !== oldPost.id)
              default:
                return current
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return posts
}