import { Experiment } from '@amplitude/experiment-js-client'
import { EXPERIMENT_DEPLOYMENT_KEY } from '@src/constent'

const experiment = Experiment.initializeWithAmplitudeAnalytics(
  EXPERIMENT_DEPLOYMENT_KEY
)

export default experiment
