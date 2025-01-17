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
import { DetectorListItem } from '../../../models/interfaces';
import { useState, useEffect } from 'react';
import {
  fillOutColors,
  getAnomalyDistributionForDetectorsByTimeRange,
} from '../utils/utils';
import ContentPanel from '../../../components/ContentPanel/ContentPanel';
import {
  EuiSelect,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingChart,
  //@ts-ignore
  EuiStat,
} from '@elastic/eui';
import { Chart, Partition, PartitionLayout } from '@elastic/charts';
import { useDispatch } from 'react-redux';
import { Datum } from '@elastic/charts';
import React from 'react';
import { TIME_RANGE_OPTIONS } from '../../Dashboard/utils/constants';
import { get, isEmpty } from 'lodash';
import {
  AD_DOC_FIELDS,
} from '../../../../server/utils/constants';
import { ALL_CUSTOM_AD_RESULT_INDICES } from '../../utils/constants'
import { searchResults } from '../../../redux/reducers/anomalyResults';
export interface AnomaliesDistributionChartProps {
  selectedDetectors: DetectorListItem[];
}

export const AnomaliesDistributionChart = (
  props: AnomaliesDistributionChartProps
) => {
  const dispatch = useDispatch();

  const [anomalyDistribution, setAnomalyDistribution] = useState(
    [] as object[]
  );

  // TODO: try to find a better way of using redux,
  // which can leverage redux, and also get rid of issue with multiple redux on same page,
  // so that we don't need to manualy update loading status
  // TODO: update issue link to new repo once it is transferred
  // Issue link: https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/issues/23
  const [anomalyResultsLoading, setAnomalyResultsLoading] = useState(true);
  const [finalDetectors, setFinalDetectors] = useState(
    [] as DetectorListItem[]
  );

  const [indicesNumber, setIndicesNumber] = useState(0);

  const [timeRange, setTimeRange] = useState(TIME_RANGE_OPTIONS[0].value);

  const getAnomalyResult = async (currentDetectors: DetectorListItem[]) => {
    setAnomalyResultsLoading(true);
    const distributionResult =
      await getAnomalyDistributionForDetectorsByTimeRange(
        searchResults,
        props.selectedDetectors,
        timeRange,
        dispatch,
        0,
        false,
        ALL_CUSTOM_AD_RESULT_INDICES
      );
    setAnomalyDistribution(distributionResult);

    const resultDetectors = getFinalDetectors(
      distributionResult,
      props.selectedDetectors
    );
    setIndicesNumber(getFinalIndices(resultDetectors).size);
    setFinalDetectors(resultDetectors);
    setAnomalyResultsLoading(false);
  };

  const getFinalIndices = (detectorList: DetectorListItem[]) => {
    const indicesSet = new Set();
    detectorList.forEach((detectorItem) => {
      indicesSet.add(detectorItem.indices.toString());
    });

    return indicesSet;
  };

  const getFinalDetectors = (
    finalAnomalyResult: object[],
    detectorList: DetectorListItem[]
  ): DetectorListItem[] => {
    const detectorSet = new Set<string>();
    finalAnomalyResult.forEach((anomalyResult) => {
      detectorSet.add(get(anomalyResult, AD_DOC_FIELDS.DETECTOR_ID, ''));
    });

    const filteredDetectors = detectorList.filter((detector) =>
      detectorSet.has(detector.id)
    );

    return filteredDetectors;
  };

  const handleOnChange = (e: any) => {
    setTimeRange(e.target.value);
  };

  useEffect(() => {
    getAnomalyResult(props.selectedDetectors);
  }, [timeRange, props.selectedDetectors]);

  return (
    <ContentPanel
      title="Anomalies by index and detector"
      titleSize="s"
      subTitle={`The inner circle shows anomaly distribution by index. 
      The outer circle shows distribution by detector.`}
      actions={
        <EuiSelect
          style={{ width: 150 }}
          id="timeRangeSelect"
          options={TIME_RANGE_OPTIONS}
          value={timeRange}
          onChange={handleOnChange}
          fullWidth
        />
      }
    >
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiStat
            description={'Indices with anomalies'}
            title={indicesNumber}
            isLoading={anomalyResultsLoading}
            titleSize="s"
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            description={'Detectors with anomalies'}
            title={finalDetectors.length}
            isLoading={anomalyResultsLoading}
            titleSize="s"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      {anomalyResultsLoading ? (
        <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow={false}>
            <EuiLoadingChart size="xl" />
          </EuiFlexItem>
        </EuiFlexGroup>
      ) : (
        <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow={false}>
            {isEmpty(anomalyDistribution) ? null : (
              <div className="anomalies-distribution-sunburst">
                <Chart>
                  <Partition
                    id="Anomalies by index and detector"
                    data={anomalyDistribution}
                    valueAccessor={(d: Datum) => d.count as number}
                    valueFormatter={(d: number) => d.toString()}
                    layers={[
                      {
                        groupByRollup: (d: Datum) => d.indices,
                        nodeLabel: (d: Datum) => {
                          return d;
                        },
                        fillLabel: {
                          textInvertible: true,
                        },
                        shape: {
                          fillColor: (d) => {
                            return fillOutColors(
                              d,
                              (d.x0 + d.x1) / 2 / (2 * Math.PI),
                              []
                            );
                          },
                        },
                      },
                      {
                        groupByRollup: (d: Datum) => d.name,
                        nodeLabel: (d: Datum) => {
                          return d;
                        },
                        fillLabel: {
                          textInvertible: true,
                        },
                        shape: {
                          fillColor: (d) => {
                            return fillOutColors(
                              d,
                              (d.x0 + d.x1) / 2 / (2 * Math.PI),
                              []
                            );
                          },
                        },
                      },
                    ]}
                    config={{
                      partitionLayout: PartitionLayout.sunburst,
                      fontFamily: 'Arial',
                      outerSizeRatio: 1,
                      fillLabel: {
                        textInvertible: true,
                      },
                      linkLabel: {
                        maxCount: 0,
                      },
                    }}
                  />
                </Chart>
              </div>
            )}
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </ContentPanel>
  );
};
