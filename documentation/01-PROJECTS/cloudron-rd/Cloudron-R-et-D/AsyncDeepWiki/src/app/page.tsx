import RepositoryInput from '@/components/RepositoryInput'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            DeepWiki Open
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-Powered Wiki Generator for GitHub, GitLab, and Bitbucket Repositories
          </p>
        </div>

        <RepositoryInput />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Generate comprehensive documentation using advanced AI models
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Platform</h3>
            <p className="text-gray-600">
              Support for GitHub, GitLab, and Bitbucket repositories
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Interactive</h3>
            <p className="text-gray-600">
              Chat with your repository using RAG and DeepResearch features
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
