import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GlobalErrorBoundary from '../components/Error/GlobalErrorBoundary';

// Mock components that might cause issues in testing environment
vi.mock('../services/api', () => ({
    default: {
        getProjects: vi.fn(),
    }
}));

describe('App Smoke Test', () => {
    it('GlobalErrorBoundary renders children when no error', () => {
        render(
            <GlobalErrorBoundary>
                <div>Safe Content</div>
            </GlobalErrorBoundary>
        );
        expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });
});
