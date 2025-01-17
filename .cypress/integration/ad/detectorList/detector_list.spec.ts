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

import { DETECTORS, TEST_DETECTOR_ID } from '../../../utils/constants';
import { DETECTOR_STATE } from '../../../../server/utils/constants';
import { buildAdAppUrl } from '../../../utils/helpers';

context('Detector list', () => {
  const EMPTY_MESSAGE =
    'A detector is an individual anomaly detection task. You can create multiple detectors, ' +
    'and all the detectors can run simultaneously, with each analyzing data from different sources. ' +
    'Create an anomaly detector to get started.';

  it('Empty detectors - no detector index', () => {
    cy.mockGetDetectorOnAction('no_detector_index_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });

    cy.contains('p', '(0)');
    cy.contains('p', EMPTY_MESSAGE);
    cy.get('.euiButton--primary.euiButton--fill').should(
      'have.length.at.least',
      2
    );
  });

  it('Empty detectors - empty detector index', () => {
    cy.mockGetDetectorOnAction('empty_detector_index_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });

    cy.contains('p', '(0)');
    cy.contains('p', EMPTY_MESSAGE);
    cy.get('.euiButton--primary.euiButton--fill').should(
      'have.length.at.least',
      2
    );
  });

  it('One detector - single stopped detector index', () => {
    cy.mockGetDetectorOnAction('single_stopped_detector_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });

    cy.contains('p', '(1)');
    cy.contains('stopped-detector');
    cy.contains('Stopped');
    cy.contains('test-index');
    cy.get('.euiButton--primary.euiButton--fill').should(
      'have.length.at.least',
      1
    );
  });

  it('Multiple detectors - multiple detectors index', () => {
    cy.mockGetDetectorOnAction('multiple_detectors_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });

    cy.contains('p', '(4)');
    cy.contains('stopped-detector');
    cy.contains('initializing-detector');
    cy.contains('running-detector');
    cy.contains('feature-required-detector');
    cy.contains('stopped-index');
    cy.contains('initializing-index');
    cy.contains('running-index');
    cy.contains('feature-required-index');
    cy.contains(DETECTOR_STATE.DISABLED);
    cy.contains(DETECTOR_STATE.INIT);
    cy.contains(DETECTOR_STATE.RUNNING);
    cy.contains(DETECTOR_STATE.FEATURE_REQUIRED);
    cy.get('.euiButton--primary.euiButton--fill').should(
      'have.length.at.least',
      1
    );
  });

  it('Redirect to create detector', () => {
    cy.mockGetDetectorOnAction('single_stopped_detector_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });
    cy.get('[data-test-subj=addDetector]').click({ force: true });
    cy.contains('span', 'Create detector');
  });

  it('Start single detector', () => {
    cy.mockGetDetectorOnAction('single_stopped_detector_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });
    cy.get('.euiTableRowCellCheckbox').within(() =>
      cy.get('.euiCheckbox__input').click({ force: true })
    );
    cy.get('[data-test-subj=listActionsButton]').click({ force: true });
    cy.get('[data-test-subj=startDetectors]').click({ force: true });
    cy.contains('The following detectors will begin initializing.');
    cy.contains('stopped-detector');
    cy.mockStartDetectorOnAction(
      'start_detector_response.json',
      TEST_DETECTOR_ID,
      () => {
        cy.get('[data-test-subj=confirmButton]').click({ force: true });
      }
    );
    cy.contains('Successfully started all selected detectors');
  });

  it('Stop single detector', () => {
    cy.mockGetDetectorOnAction('single_running_detector_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });
    cy.get('.euiTableRowCellCheckbox').within(() =>
      cy.get('.euiCheckbox__input').click({ force: true })
    );
    cy.get('[data-test-subj=listActionsButton]').click({ force: true });
    cy.get('[data-test-subj=stopDetectors]').click({ force: true });
    cy.contains('The following detectors will be stopped.');
    cy.contains('running-detector');
    cy.mockStopDetectorOnAction(
      'stop_detector_response.json',
      TEST_DETECTOR_ID,
      () => {
        cy.get('[data-test-subj=confirmButton]').click({ force: true });
      }
    );
    cy.contains('Successfully stopped all selected detectors');
  });

  it.skip('Delete single detector', () => {
    cy.mockGetDetectorOnAction('single_stopped_detector_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });
    cy.get('.euiTableRowCellCheckbox').within(() =>
      cy.get('.euiCheckbox__input').click({ force: true })
    );
    cy.get('[data-test-subj=listActionsButton]').click({ force: true });
    cy.get('[data-test-subj=deleteDetectors]').click({ force: true });
    cy.contains(
      'The following detectors and feature configurations will be permanently removed. This action is irreversible.'
    );
    cy.contains('stopped-detector');
    cy.contains('Running');
    cy.contains('No');
    cy.get('[data-test-subj=typeDeleteField]')
      .click({ force: true })
      .type('delete');
    cy.mockDeleteDetectorOnAction(
      'delete_detector_response.json',
      TEST_DETECTOR_ID,
      () => {
        cy.get('[data-test-subj=confirmButton]').click({ force: true });
      }
    );
    cy.contains('Successfully deleted all selected detectors');
  });

  it('Filter by detector search', () => {
    cy.mockGetDetectorOnAction('multiple_detectors_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });

    cy.contains('stopped-detector');
    cy.contains('running-detector');

    cy.get('[data-test-subj=detectorListSearch]')
      .first()
      .click({ force: true })
      .type('stopped-detector');

    cy.contains('stopped-detector');
    cy.contains('running-detector').should('not.be.visible');
  });

  it('Filter by detector state', () => {
    cy.mockGetDetectorOnAction('multiple_detectors_response.json', () => {
      cy.visit(buildAdAppUrl(DETECTORS));
    });

    cy.contains('stopped-detector');
    cy.contains('running-detector');

    cy.get('[data-test-subj=comboBoxToggleListButton]')
      .first()
      .click({ force: true });
    cy.get('.euiFilterSelectItem').first().click({ force: true });
    cy.get('.euiPageSideBar').click({ force: true });

    cy.contains('stopped-detector'); // because stopped is the first item in the detector state dropdown
    cy.contains('running-detector').should('not.be.visible');
  });
});
