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
import { ReactElement } from 'react'
import { Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import { useGetMonitoringQuery } from 'client/features/OneApi/vm'
import { Chartist } from 'client/components/Charts'
import { Tr } from 'client/components/HOC'
import { prettyBytes } from 'client/utils'
import { T } from 'client/constants'

const useStyles = makeStyles({
  container: {
    gridColumn: '1 / -1',
  },
})

const interpolationX = (value) => DateTime.fromMillis(value).toFormat('HH:mm')

/**
 * Render Graphs Capacity.
 *
 * @param {object} props - Props
 * @param {string} props.id - Virtual machine id
 * @returns {ReactElement} Capacity Graphs.
 */
const Graphs = ({ id }) => {
  const classes = useStyles()
  const { data: monitoring = [] } = useGetMonitoringQuery(id)

  return (
    <Grid container spacing={1} className={classes.container}>
      <Chartist
        name={Tr(T.RealCpu)}
        filter={['CPU']}
        data={monitoring}
        y="CPU"
        x="TIMESTAMP"
        interpolationX={interpolationX}
      />
      <Chartist
        name={Tr(T.RealMemory)}
        filter={['MEMORY']}
        data={monitoring}
        y="MEMORY"
        x="TIMESTAMP"
        interpolationY={(value) => prettyBytes(value)}
        interpolationX={interpolationX}
      />
    </Grid>
  )
}

Graphs.propTypes = {
  id: PropTypes.string,
}

Graphs.displayName = 'Graphs'

export default Graphs
