'use client';

import { useState } from 'react';

const ScraperComponent: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [result, setResult] = useState<{ productName: string; productPrice: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`/api/scraper?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Amazon Product Scraper</h1>
            <input
                type="text"
                placeholder="Enter product URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleScrape} disabled={loading}>
                {loading ? 'Loading...' : 'Scrape Product'}
            </button>
            {result && (
                <div>
                    <h2>Product Details</h2>
                    <p><strong>Product Name:</strong> {result.productName}</p>
                    <p><strong>Product Price:</strong> {result.productPrice}</p>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ScraperComponent;
