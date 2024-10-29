import { render, screen, fireEvent } from '@testing-library/react';
import { CourseCreatorWizard } from '../course-creator-wizard';

describe('CourseCreatorWizard', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders first step by default', () => {
    render(<CourseCreatorWizard onSubmit={mockSubmit} />);
    expect(screen.getByPlaceholderText('Course Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Course Description')).toBeInTheDocument();
  });

  it('navigates between steps', () => {
    render(<CourseCreatorWizard onSubmit={mockSubmit} />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CourseCreatorWizard onSubmit={mockSubmit} />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Create Course'));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });
}); 