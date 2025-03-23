import { createClient } from '@/utils/supabase/server';

export default async function TestSupabasePage() {
  const supabase = await createClient();
  
  // Fetch data from all three tables
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('*')
    .limit(5);
  
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .limit(5);
  
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(5);
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Integration Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        {membersError ? (
          <p className="text-red-500">Error loading members: {membersError.message}</p>
        ) : members && members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div key={member.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <p className="mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No members found. You may need to add some data to your Supabase database.</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Events</h2>
        {eventsError ? (
          <p className="text-red-500">Error loading events: {eventsError.message}</p>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <div key={event.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{event.title}</h3>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-600">{event.location}</p>
                <p className="mt-2">{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No events found. You may need to add some data to your Supabase database.</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Blog Posts</h2>
        {blogError ? (
          <p className="text-red-500">Error loading blog posts: {blogError.message}</p>
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-gray-600">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
                <div className="mt-2" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
              </div>
            ))}
          </div>
        ) : (
          <p>No blog posts found. You may need to add some data to your Supabase database.</p>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Connection Information</h2>
        <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://odilwecffsvoxegpxafl.supabase.co'}</p>
        <p>Connected successfully: {!membersError && !eventsError && !blogError ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
