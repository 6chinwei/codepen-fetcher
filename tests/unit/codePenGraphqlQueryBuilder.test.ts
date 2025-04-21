import type { FetchPensOptions } from '../../src/types';
import { describe, it, expect } from 'vitest';
import CodePenGraphqlQueryBuilder from '../../src/codePenGraphqlQueryBuilder';

describe('CodePenGraphqlQueryBuilder', () => {
  const queryBuilder = new CodePenGraphqlQueryBuilder();

  describe('buildGetPenByIdQuery', () => {
    it('should build a query for getting a pen by ID', () => {
      const penId = '12345';
      const query = queryBuilder.buildGetPenByIdQuery(penId);

      expect(query).toContain(`query { pen (id: "${penId}") {`);
      expect(query).toContain('title');
      expect(query).toContain('config');
    });
  });

  describe('buildGetPensByUserIdQuery with options', () => {
    it('should build a query for getting pens by user ID', () => {
      const userId = 'user123';
      const options: FetchPensOptions = { cursor: 'abc', limit: 5, sortBy: 'Id', sortOrder: 'Desc' };
      const query = queryBuilder.buildGetPensByUserIdQuery(userId, options);

      expect(query).toContain(`query { pens (input: { filters: { userId: "${userId}" }`);
      expect(query).toContain('pagination');
      expect(query).toContain(`cursor: "${options.cursor}"`);
      expect(query).toContain(`limit: ${options.limit}`);
      expect(query).toContain(`sortBy: ${options.sortBy}`);
      expect(query).toContain(`sortOrder: ${options.sortOrder}`);
      expect(query).toContain('pens {');
      expect(query).toContain('title');
    });
  });

  describe('buildGetPensByUserIdQuery without options', () => {
    it('should build a query for getting pens by user ID', () => {
      const userId = 'user123';
      const query = queryBuilder.buildGetPensByUserIdQuery(userId);

      expect(query).toContain(`query { pens (input: { filters: { userId: "${userId}" }`);
      expect(query).toContain('pagination');
      expect(query).toContain(`limit: ${CodePenGraphqlQueryBuilder.DEFAULT_FETCH_LIMIT}`);

      expect(query).not.toContain('cursor');
      expect(query).not.toContain('sortBy');
      expect(query).not.toContain('sortOrder');
    });
  });

  describe('buildGetProfileByUsernameQuery', () => {
    it('should build a query for getting a user profile by username', () => {
      const username = 'testuser';
      const query = queryBuilder.buildGetProfileByUsernameQuery(username);

      expect(query).toContain(`query { ownerByUsername (ownerUsername: "${username}"`);
      expect(query).toContain(`ownerType: ${CodePenGraphqlQueryBuilder.CODEPEN_OBJECT_TYPES.USER}`);
      expect(query).toContain('username');
    });
  });
});
