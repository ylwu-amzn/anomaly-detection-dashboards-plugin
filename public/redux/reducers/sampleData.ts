/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { APIAction, APIResponseAction, HttpSetup } from '../middleware/types';
import handleActions from '../utils/handleActions';
import { AD_NODE_API } from '../../../utils/constants';
import { SAMPLE_TYPE } from '../../../server/utils/constants';
import { get } from 'lodash';

const CREATE_SAMPLE_DATA = 'ad/CREATE_SAMPLE_DATA';

export interface SampleDataState {
  requesting: boolean;
  errorMessage: string;
}
export const initialState: SampleDataState = {
  requesting: false,
  errorMessage: '',
};

const reducer = handleActions<SampleDataState>(
  {
    [CREATE_SAMPLE_DATA]: {
      REQUEST: (state: SampleDataState): SampleDataState => ({
        ...state,
        requesting: true,
        errorMessage: '',
      }),
      SUCCESS: (
        state: SampleDataState,
        action: APIResponseAction
      ): SampleDataState => ({
        ...state,
        requesting: false,
      }),
      FAILURE: (
        state: SampleDataState,
        action: APIResponseAction
      ): SampleDataState => ({
        ...state,
        requesting: false,
        errorMessage: get(action, 'error.error', action.error),
      }),
    },
  },
  initialState
);

export const createSampleData = (sampleDataType: SAMPLE_TYPE): APIAction => ({
  type: CREATE_SAMPLE_DATA,
  request: (client: HttpSetup) =>
    client.post(`..${AD_NODE_API.CREATE_SAMPLE_DATA}/${sampleDataType}`),
});

export default reducer;
