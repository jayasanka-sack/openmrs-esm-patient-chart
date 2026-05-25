import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openmrsFetch, restBaseUrl, type FetchResponse } from '@openmrs/esm-framework';
import { deleteProcedure } from './procedures.resource';

const mockOpenmrsFetch = vi.mocked(openmrsFetch);

describe('deleteProcedure', () => {
  const procedureUuid = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    mockOpenmrsFetch.mockReset();
    mockOpenmrsFetch.mockResolvedValue({ status: 200, data: {} } as unknown as FetchResponse);
  });

  it('sends a DELETE request without a reason query param when no reason is provided', async () => {
    await deleteProcedure(procedureUuid);

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${restBaseUrl}/procedure/${procedureUuid}`, {
      method: 'DELETE',
    });
  });

  it('appends the reason as a URL-encoded query param when one is provided', async () => {
    await deleteProcedure(procedureUuid, 'Entered in error');

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      `${restBaseUrl}/procedure/${procedureUuid}?reason=Entered%20in%20error`,
      { method: 'DELETE' },
    );
  });

  it('treats a whitespace-only reason as empty and omits the query param', async () => {
    await deleteProcedure(procedureUuid, '   ');

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${restBaseUrl}/procedure/${procedureUuid}`, {
      method: 'DELETE',
    });
  });

  it('trims surrounding whitespace before encoding the reason', async () => {
    await deleteProcedure(procedureUuid, '  Wrong patient  ');

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${restBaseUrl}/procedure/${procedureUuid}?reason=Wrong%20patient`, {
      method: 'DELETE',
    });
  });
});
