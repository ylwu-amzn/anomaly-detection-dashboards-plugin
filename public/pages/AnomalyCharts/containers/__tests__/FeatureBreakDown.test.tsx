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

import React from 'react';
import { render } from '@testing-library/react';
import { getRandomDetector } from '../../../../redux/reducers/__tests__/utils';
import { FeatureBreakDown } from '../FeatureBreakDown';
import { FeatureAggregationData } from 'public/models/interfaces';
import { CoreServicesContext } from '../../../../components/CoreServices/CoreServices';
import { coreServicesMock } from '../../../../../test/mocks';

describe('<FeatureBreakDown /> spec', () => {
  const dateRange = {
    startDate: 1587431440000,
    endDate: 1587456780000,
  };
  const detector = getRandomDetector(false);
  let featureData: { [key: string]: FeatureAggregationData[] } = {};
  detector.featureAttributes.forEach((feature) => {
    if (feature.featureId) {
      featureData[feature.featureId] = [
        {
          endTime: 1587456740000,
          startTime: 1587431540000,
          data: 120,
        },
      ];
    }
  });
  const anomaliesResult = {
    anomalies: [
      {
        anomalyGrade: 0.3,
        anomalyScore: 0.56,
        confidence: 0.8,
        detectorId: detector.id,
        endTime: 1587456740000,
        startTime: 1587431540000,
      },
    ],
    featureData: featureData,
  };
  test('renders the component', () => {
    console.error = jest.fn();
    const { container } = render(
      <CoreServicesContext.Provider value={coreServicesMock}>
        <FeatureBreakDown
          title="test"
          detector={detector}
          anomalyAndFeatureResults={[anomaliesResult]}
          annotations={[]}
          isLoading={false}
          dateRange={dateRange}
          featureDataSeriesName="feature data"
        />
      </CoreServicesContext.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
