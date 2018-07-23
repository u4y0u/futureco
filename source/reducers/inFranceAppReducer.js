/* @flow */

import { combineReducers } from 'redux'
import type {
	Action,
	CompanyLegalStatus,
	State
} from 'Types/companyStatusTypes'

function companyLegalStatus(
	state: CompanyLegalStatus = {},
	action: Action
): CompanyLegalStatus {
	switch (action.type) {
		case 'CHOOSE_COMPANY_LEGAL_SETUP':
			return { ...state, liability: action.setup }

		case 'DEFINE_DIRECTOR_STATUS':
			return { ...state, directorStatus: action.status }
		case 'COMPANY_HAVE_MULTIPLE_ASSOCIATES':
			return { ...state, multipleAssociates: action.multipleAssociates }
		case 'COMPANY_IS_MICROENTERPRISE':
			return { ...state, microenterprise: action.microenterprise }
	}
	return state
}

function checklists(
	state: { [string]: { [string]: boolean } } = { hire: {}, register: {} },
	action: Action
) {
	switch (action.type) {
		case 'CHANGE_CHECKLIST_ITEM':
			return {
				...state,
				[action.checklist]: {
					...state[action.checklist],
					...{ [action.name]: action.value }
				}
			}
		default:
			return state
	}
}

function existingCompanyDetails(
	state: ?{ [string]: string } = null,
	action: Action
): ?{ [string]: string } {
	switch (action.type) {
		case 'SAVE_EXISTING_COMPANY_DETAILS':
			return action.details
		default:
			return state
	}
}

function companyRegistrationStarted(
	state: boolean = false,
	action: Action
) {
	if (action.type ==='START_COMPANY_REGISTRATION') {
		return true;
	}
	return state;
}

// $FlowFixMe
export default (combineReducers({
	companyLegalStatus,
	checklists,
	companyRegistrationStarted,
	existingCompanyDetails
}): (State, Action) => State)
