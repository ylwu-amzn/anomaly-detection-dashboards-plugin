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
import { Anomalies } from '../../models/interfaces';

const PREVIEW_DETECTOR = 'ad/PREVIEW_DETECTOR';

export interface PreviewAnomalies {
  requesting: boolean;
  anomaliesResult: Anomalies;
  errorMessage: string;
}
export const initialDetectorsState: PreviewAnomalies = {
  requesting: false,
  anomaliesResult: {
    anomalies: [],
    featureData: {},
  },
  errorMessage: '',
};

const reducer = handleActions<PreviewAnomalies>(
  {
    [PREVIEW_DETECTOR]: {
      REQUEST: (state: PreviewAnomalies): PreviewAnomalies => ({
        ...state,
        requesting: true,
        errorMessage: '',
      }),
      SUCCESS: (
        state: PreviewAnomalies,
        action: APIResponseAction
      ): PreviewAnomalies => ({
        ...state,
        requesting: false,
        anomaliesResult: action.result.response,
      }),
      FAILURE: (
        state: PreviewAnomalies,
        action: APIResponseAction
      ): PreviewAnomalies => ({
        ...state,
        requesting: false,
        errorMessage: action.error,
      }),
    },
  },
  initialDetectorsState
);

export const previewDetector = (requestBody: any): APIAction => ({
  type: PREVIEW_DETECTOR,
  request: (client: HttpSetup) =>
    client.post(`..${AD_NODE_API.DETECTOR}/preview`, {
      body: JSON.stringify(requestBody),
    }),
});

export default reducer;
