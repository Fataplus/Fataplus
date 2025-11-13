'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RepositoryInput() {
  const [repoUrl, setRepoUrl] = useState('')
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement repository processing
      console.log('Processing repository:', repoUrl)
      console.log('Token provided:', !!token)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

    } catch (error) {
      console.error('Error processing repository:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Wiki</CardTitle>
        <CardDescription>
          Enter a repository URL to generate an AI-powered wiki
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              type="url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Supports GitHub, GitLab, and Bitbucket URLs
            </p>
          </div>

          <div>
            <Label htmlFor="token">Personal Access Token (Optional)</Label>
            <Input
              id="token"
              type="password"
              placeholder="For private repositories"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Required for private repositories. Higher rate limits for public repos.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !repoUrl}
          >
            {isLoading ? 'Generating Wiki...' : 'Generate Wiki'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
