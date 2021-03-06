import React, { useState, useReducer } from 'react'

import { alert } from 'services'
import { useMutation } from 'services/apollo'

import { useConfiguration } from 'contexts'

import { Input, Checkbox, Button, PairInputList, Icon, Radio } from 'components'
import Card, { CardTitle, CardText, CardActions } from 'components/Card'

import { onListChangeActions } from 'helpers/onListChange'

import { reducer, tagsToList, listToTags, synonymsToList, listToSynonyms } from './helpers'

import { updateConfigurationMutation } from './queries'

import './Settings.scss'

const Settings = ({ configuration: conf }) => {
  const configuration = useConfiguration()

  const [loading, setLoading] = useState(false)

  const [state, dispatch] = useReducer(reducer, {
    ...conf,
    tags: tagsToList(conf.tags),
    synonyms: synonymsToList(conf.algoliaSynonyms),
    authorizedDomains: conf.authorizedDomains.join(', '),
    bugReporting: conf.bugReporting || 'GITHUB'
  })

  const [, mutate] = useMutation(updateConfigurationMutation)

  const onSave = () => {
    setLoading(true)
    mutate({
      title: state.title,
      tags: listToTags(state.tags),
      algoliaSynonyms: listToSynonyms(state.synonyms),
      workplaceSharing: state.workplaceSharing,
      authorizedDomains: state.authorizedDomains
        .split(',')
        .map(x => x.trim())
        .filter(x => x),
      bugReporting: state.bugReporting
    })
      .then(() => {
        alert.pushSuccess('The answer was successfully edited!')
        configuration.reload()
      })
      .catch(error => {
        alert.pushDefaultError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <Card>
        <CardTitle>
          <h1 className="centered" style={{ width: '100%' }}>
            Settings
          </h1>
        </CardTitle>
        <CardText>
          <h2>Title</h2>
          <br />
          <div className="inline-input">
            <Icon material="home" />
            <Input
              value={state.title}
              onChange={e => dispatch({ type: 'change_title', data: e.target.value })}
              placeholder="Title"
              disabled={loading}
            />
          </div>
          <br />
          <hr />
          <h2>Tags</h2>
          <br />
          <PairInputList
            pairs={state.tags}
            options={{
              icons: { line: 'local_offer', value: 'list' },
              labels: {
                add: 'Add tags',
                more: 'More tags',
                key: 'Category',
                value: 'Tags'
              }
            }}
            actions={onListChangeActions('tags', dispatch)}
            disabled={loading}
          />
          <hr />
          <h2>Synonyms</h2>
          <br />
          <PairInputList
            pairs={state.synonyms}
            options={{
              icons: { line: 'loop', value: 'list' },
              labels: {
                add: 'Add a synonym',
                more: 'More synonyms',
                key: 'ID',
                value: 'Synonyms'
              }
            }}
            actions={onListChangeActions('synonyms', dispatch)}
            disabled={loading}
          />
          <hr />
          <h2>Integrations</h2>
          <br />
          <div style={{ marginLeft: '1rem' }}>
            <Checkbox
              label="Enable workplace sharing"
              checked={state.workplaceSharing}
              onChange={e =>
                dispatch({
                  type: 'toggle_workplace',
                  data: e.target.checked
                })
              }
              disabled={loading}
            />
          </div>
          <br />
          <hr />
          <h2>Authorized domains</h2>
          <br />
          <div className="inline-input">
            <Icon material="domain" />
            <Input
              style={{ flex: 1 }}
              value={state.authorizedDomains}
              onChange={e => dispatch({ type: 'change_domains', data: e.target.value })}
              placeholder="Ex: zenika.com, google.com, ..."
              disabled={loading}
            />
          </div>
          <hr />
          <h2>Bug reporting</h2>
          <br />
          <div style={{ marginLeft: '1rem' }}>
            <Radio.Group
              name="bug_reporting"
              selected={state.bugReporting}
              onChange={data => dispatch({ type: 'change_bug_reporting', data })}
              disabled={loading}
            >
              <Radio label="By email" value="MAIL" />
              <Radio label="By Github" value="GITHUB" />
            </Radio.Group>
          </div>
        </CardText>
        <CardActions>
          <Button primary label="Save" onClick={onSave} loading={loading} />
        </CardActions>
      </Card>
    </div>
  )
}

export default Settings
