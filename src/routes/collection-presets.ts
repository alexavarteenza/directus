import express from 'express';
import asyncHandler from 'express-async-handler';
import sanitizeQuery from '../middleware/sanitize-query';
import validateQuery from '../middleware/validate-query';
import * as CollectionPresetsService from '../services/collection-presets';
import useCollection from '../middleware/use-collection';
import * as ActivityService from '../services/activity';

const router = express.Router();

router.post(
	'/',
	useCollection('directus_collection_presets'),
	asyncHandler(async (req, res) => {
		const record = await CollectionPresetsService.createCollectionPreset(
			req.body,
			res.locals.query
		);

		ActivityService.createActivity({
			action: ActivityService.Action.CREATE,
			collection: 'directus_collection_presets',
			item: record.id,
			ip: req.ip,
			user_agent: req.get('user-agent'),
			action_by: req.user,
		});

		return res.json({ data: record });
	})
);

router.get(
	'/',
	useCollection('directus_collection_presets'),
	sanitizeQuery,
	validateQuery,
	asyncHandler(async (req, res) => {
		const records = await CollectionPresetsService.readCollectionPresets(res.locals.query);
		return res.json({ data: records });
	})
);

router.get(
	'/:pk',
	useCollection('directus_collection_presets'),
	sanitizeQuery,
	validateQuery,
	asyncHandler(async (req, res) => {
		const record = await CollectionPresetsService.readCollectionPreset(
			req.params.pk,
			res.locals.query
		);
		return res.json({ data: record });
	})
);

router.patch(
	'/:pk',
	useCollection('directus_collection_presets'),
	asyncHandler(async (req, res) => {
		const record = await CollectionPresetsService.updateCollectionPreset(
			req.params.pk,
			req.body,
			res.locals.query
		);

		ActivityService.createActivity({
			action: ActivityService.Action.UPDATE,
			collection: 'directus_collection_presets',
			item: record.id,
			ip: req.ip,
			user_agent: req.get('user-agent'),
			action_by: req.user,
		});

		return res.json({ data: record });
	})
);

router.delete(
	'/:pk',
	useCollection('directus_collection_presets'),
	asyncHandler(async (req, res) => {
		await CollectionPresetsService.deleteCollectionPreset(req.params.pk);

		ActivityService.createActivity({
			action: ActivityService.Action.DELETE,
			collection: 'directus_collection_presets',
			item: req.params.pk,
			ip: req.ip,
			user_agent: req.get('user-agent'),
			action_by: req.user,
		});

		return res.status(200).end();
	})
);

export default router;
