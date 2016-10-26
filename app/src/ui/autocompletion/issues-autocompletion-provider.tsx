import * as React from 'react'
import { IAutocompletionProvider } from './index'
import { IssuesStore } from '../../lib/dispatcher'
import { GitHubRepository } from '../../models/github-repository'

/** An autocompletion hit for an issue. */
export interface IIssueHit {
  /** The title of the issue. */
  readonly title: string

  /** The issue's number. */
  readonly number: string
}

/** The autocompletion provider for issues in a GitHub repository. */
export class IssuesAutocompletionProvider implements IAutocompletionProvider<IIssueHit> {
  private readonly issuesStore: IssuesStore
  private readonly repository: GitHubRepository

  public constructor(issuesStore: IssuesStore, repository: GitHubRepository) {
    this.issuesStore = issuesStore
    this.repository = repository
  }

  public getRegExp(): RegExp {
    return /(?:^|\n| )(?:#)([a-z0-9\\+\\-][a-z0-9_]*)?/g
  }

  public getAutocompletionItems(text: string): Promise<ReadonlyArray<IIssueHit>> {
    return this.issuesStore.getIssuesMatching(this.repository, text)
  }

  public renderItem(item: IIssueHit): JSX.Element {
    return (
      <div className='issue' key={item.number}>
        <span className='number'>#{item.number}</span>
        <span className='title'>{item.title}</span>
      </div>
    )
  }

  public getCompletionText(item: IIssueHit): string {
    return `#${item.number}`
  }
}
