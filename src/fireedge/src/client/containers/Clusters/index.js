/* ------------------------------------------------------------------------- *
 * Copyright 2002-2022, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { ReactElement, useState, memo } from 'react'
import PropTypes from 'prop-types'
import GotoIcon from 'iconoir-react/dist/Pin'
import RefreshDouble from 'iconoir-react/dist/RefreshDouble'
import Cancel from 'iconoir-react/dist/Cancel'
import { Typography, Box, Stack, Chip } from '@mui/material'
import { Row } from 'react-table'

import {
  useLazyGetClustersQuery,
  useUpdateClusterMutation,
} from 'client/features/OneApi/cluster'
import { ClustersTable } from 'client/components/Tables'
import ClusterTabs from 'client/components/Tabs/Cluster'
import SplitPane from 'client/components/SplitPane'
import MultipleTags from 'client/components/MultipleTags'
import { SubmitButton } from 'client/components/FormControl'
import { Tr } from 'client/components/HOC'
import { T, Cluster } from 'client/constants'

/**
 * Displays a list of Clusters with a split pane between the list and selected row(s).
 *
 * @returns {ReactElement} Clusters list and selected row(s)
 */
function Clusters() {
  const [selectedRows, onSelectedRowsChange] = useState(() => [])

  const hasSelectedRows = selectedRows?.length > 0
  const moreThanOneSelected = selectedRows?.length > 1

  return (
    <SplitPane gridTemplateRows="1fr auto 1fr">
      {({ getGridProps, GutterComponent }) => (
        <Box height={1} {...(hasSelectedRows && getGridProps())}>
          <ClustersTable
            onSelectedRowsChange={onSelectedRowsChange}
            useUpdateMutation={useUpdateClusterMutation}
          />

          {hasSelectedRows && (
            <>
              <GutterComponent direction="row" track={1} />
              {moreThanOneSelected ? (
                <GroupedTags tags={selectedRows} />
              ) : (
                <InfoTabs
                  cluster={selectedRows[0]?.original}
                  gotoPage={selectedRows[0]?.gotoPage}
                  unselect={() => selectedRows[0]?.toggleRowSelected(false)}
                />
              )}
            </>
          )}
        </Box>
      )}
    </SplitPane>
  )
}

/**
 * Displays details of a Cluster.
 *
 * @param {Cluster} cluster - Cluster to display
 * @param {Function} [gotoPage] - Function to navigate to a page of a Cluster
 * @param {Function} [unselect] - Function to unselect a Cluster
 * @returns {ReactElement} Cluster details
 */
const InfoTabs = memo(({ cluster, gotoPage, unselect }) => {
  const [get, { data: lazyData, isFetching }] = useLazyGetClustersQuery()
  const id = lazyData?.ID ?? cluster.ID
  const name = lazyData?.NAME ?? cluster.NAME

  return (
    <Stack overflow="auto">
      <Stack direction="row" alignItems="center" gap={1} mx={1} mb={1}>
        <Typography color="text.primary" noWrap flexGrow={1}>
          {`#${id} | ${name}`}
        </Typography>

        {/* -- ACTIONS -- */}
        <SubmitButton
          data-cy="detail-refresh"
          icon={<RefreshDouble />}
          tooltip={Tr(T.Refresh)}
          isSubmitting={isFetching}
          onClick={() => get({ id })}
        />
        {typeof gotoPage === 'function' && (
          <SubmitButton
            data-cy="locate-on-table"
            icon={<GotoIcon />}
            tooltip={Tr(T.LocateOnTable)}
            onClick={() => gotoPage()}
          />
        )}
        {typeof unselect === 'function' && (
          <SubmitButton
            data-cy="unselect"
            icon={<Cancel />}
            tooltip={Tr(T.Close)}
            onClick={() => unselect()}
          />
        )}
        {/* -- END ACTIONS -- */}
      </Stack>
      <ClusterTabs id={id} />
    </Stack>
  )
})

InfoTabs.propTypes = {
  cluster: PropTypes.object.isRequired,
  gotoPage: PropTypes.func,
  unselect: PropTypes.func,
}

InfoTabs.displayName = 'InfoTabs'

/**
 * Displays a list of tags that represent the selected rows.
 *
 * @param {Row[]} tags - Row(s) to display as tags
 * @returns {ReactElement} List of tags
 */
const GroupedTags = memo(({ tags = [] }) => (
  <Stack direction="row" flexWrap="wrap" gap={1} alignContent="flex-start">
    <MultipleTags
      limitTags={10}
      tags={tags?.map(({ original, id, toggleRowSelected, gotoPage }) => (
        <Chip
          key={id}
          label={original?.NAME ?? id}
          onClick={gotoPage}
          onDelete={() => toggleRowSelected(false)}
        />
      ))}
    />
  </Stack>
))

GroupedTags.propTypes = { tags: PropTypes.array }
GroupedTags.displayName = 'GroupedTags'

export default Clusters
