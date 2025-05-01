import React from 'react';
import { Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      {movie.Poster && movie.Poster !== 'N/A' ? (
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-96 object-cover"
        />
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
          <Film className="h-16 w-16 text-gray-400" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{movie.Title}</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{movie.Year}</span>
          <span>{movie.Type}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;