import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
    it('truncates a string', () => {
        expect(new TruncatePipe().transform('Hello world', 5)).toEqual(
            'Hello...'
        );
    });

    it('returns the string unchanged if it is shorter than the limit', () => {
        expect(new TruncatePipe().transform('Hello world', 20)).toEqual(
            'Hello world'
        );
    });

    it('omits the final character if it is whitespace', () => {
        expect(new TruncatePipe().transform('Hello world', 6)).toEqual(
            'Hello...'
        );
    });
});
