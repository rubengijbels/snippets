import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios"

import { State } from "store/state"
import { Dispatch, Store } from "utils/bazaar"
import { refresh } from "actions/account";


const api = (store : Store<State>) =>
{
	let config : AxiosRequestConfig = {
		baseURL: `${SERVICE_URL}/api`
	}

	const state = store.getState()

	if(state.actor.type === "loggedIn")
	{
		config = {
			...config,
			headers:
			{
				"Authorization": `Bearer ${state.actor.auth.access.token}`
			}
		}
	}

	const _api = axios.create(config)

	//on auth catch response error
	const enable401interceptor = () =>
	{
		const interceptor = _api.interceptors.response.use(
			response => response,
			async ( error: AxiosError ) =>
			{
				if(error.response == null)
					throw error

				if(error.response.status !== 401)
					throw error

				console.log("unauthenticated!")
				// Unauthenticated
				_api.interceptors.response.eject(interceptor)

				const dtoToken = await refresh(store)

				if(dtoToken.error)
					throw error

				const newConfig : AxiosRequestConfig = {
					...error.config,
					headers: {
						...error.config.headers,
						"Authorization" : `Bearer ${dtoToken.data}`
					}
				}

				const response = await axios.request(newConfig)

				enable401interceptor()
				return response
			}
		)
	}
	enable401interceptor()

	return _api
}

export default api


interface BaseApiResult
{
	error: boolean
}

interface SuccessfulApiResult<T> extends BaseApiResult
{
	error: false
	data: T
}

interface UnsuccessfulApiResult extends BaseApiResult
{
	error: true
	code: number
}

export type ApiResult<T> = SuccessfulApiResult<T> | UnsuccessfulApiResult

export const transformApiError = (error: any) : UnsuccessfulApiResult =>
{
	const err = error as AxiosError

	if(err.response == null)
		return { error: true, code: 0 }

	return {
		error: true,
		code: err.response.data.Code
	}
}

export const transformApiSuccess = <T>(data: T) : SuccessfulApiResult<T> =>
{
	return {
		error: false,
		data
	}
}
