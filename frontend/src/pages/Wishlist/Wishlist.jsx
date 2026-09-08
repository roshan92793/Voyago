import { destinations } from '../../data/destinations';
import { useWishlist } from '../../hooks';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const wishlisted = destinations.filter((d) => wishlist.includes(d.id));

  return (
    <div className="wishlist section-padding" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="page-header">
          <h1>My <span className="text-gradient">Wishlist</span></h1>
          <p>{wishlisted.length} saved destination{wishlisted.length !== 1 ? 's' : ''}</p>
        </div>

        {wishlisted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Start exploring and save destinations you love.</p>
            <a href="/explore" id="wishlist-explore-link" className="btn btn--primary btn--md">Explore Destinations →</a>
          </div>
        ) : (
          <div className="grid-4" style={{ marginTop: '2.5rem' }}>
            {wishlisted.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
