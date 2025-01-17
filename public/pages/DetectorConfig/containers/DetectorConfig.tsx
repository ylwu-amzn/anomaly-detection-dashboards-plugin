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

import React, { useEffect } from 'react';
import { DetectorDefinitionFields } from '../../ReviewAndCreate/components/DetectorDefinitionFields';
import { Features } from './Features';
import { DetectorJobs } from './DetectorJobs';
import { EuiSpacer, EuiPage, EuiPageBody } from '@elastic/eui';
import { RouteComponentProps } from 'react-router';
import { AppState } from '../../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { getDetector } from '../../../redux/reducers/ad';
import { EuiLoadingSpinner } from '@elastic/eui';
interface DetectorConfigProps extends RouteComponentProps {
  detectorId: string;
  onEditFeatures(): void;
  onEditDetector(): void;
}

export function DetectorConfig(props: DetectorConfigProps) {
  const dispatch = useDispatch();
  const detector = useSelector(
    (state: AppState) => state.ad.detectors[props.detectorId]
  );

  useEffect(() => {
    dispatch(getDetector(props.detectorId));
  }, []);

  return (
    <EuiPage style={{ marginTop: '16px', paddingTop: '0px' }}>
      {detector ? (
        <EuiPageBody>
          <EuiSpacer size="l" />
          <DetectorDefinitionFields
            detector={detector}
            onEditDetectorDefinition={props.onEditDetector}
            isCreate={false}
          />
          <EuiSpacer />
          <Features
            detectorId={props.detectorId}
            detector={detector}
            onEditFeatures={props.onEditFeatures}
          />
          <EuiSpacer />
          <DetectorJobs detector={detector} />
        </EuiPageBody>
      ) : (
        <div>
          <EuiLoadingSpinner size="s" />
          &nbsp;&nbsp;
          <EuiLoadingSpinner size="m" />
          &nbsp;&nbsp;
          <EuiLoadingSpinner size="l" />
          &nbsp;&nbsp;
          <EuiLoadingSpinner size="xl" />
        </div>
      )}
    </EuiPage>
  );
}
