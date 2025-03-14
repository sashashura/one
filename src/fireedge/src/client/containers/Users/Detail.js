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
import { useParams, Redirect } from 'react-router-dom'

import UserTabs from 'client/components/Tabs/User'

/**
 * Displays the detail information about a User.
 *
 * @returns {ReactElement} User detail component.
 */
function UserDetail() {
  const { id } = useParams()

  if (Number.isNaN(+id)) {
    return <Redirect to="/" />
  }

  return <UserTabs id={id} />
}

export default UserDetail
