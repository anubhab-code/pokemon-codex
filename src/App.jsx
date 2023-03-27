import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const App = () =>  {
    const [pokemons, setPokemon] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            // const temp = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&page=${page}`);
            const temp = await fetch(loadMore)
            const data = await temp.json();
            setLoadMore(data.next); 
            // console.log(page);

            // const handlesearch = (e) => {
            //     setSearch(e.target.value);
            // }

            function createPokemonObject(results) {
                results.forEach(async pokemon => {
                    const temp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
                    const data = await temp.json();
                    setPokemon(currentList => [...currentList, data]);
                    setFilteredPokemons(currentList => [...currentList, data]);
                });
            }
            createPokemonObject(data.results);
            
        };
        
        fetchData();
        
    }, [page]);

    useEffect(() => {
        // console.log(search, 'search')
        const filtered = pokemons.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredPokemons(filtered);
    }, [search]);

    const handlescroll = async () => {
        if ((window.innerHeight + document.documentElement.scrollTop + 1) >= document.documentElement.scrollHeight ) {
            setPage((page) => page + 1);
        }
    }
    

    useEffect(() => {
        window.addEventListener('scroll', handlescroll);
        return () => window.removeEventListener('scroll', handlescroll);
    }, []);


    return (
        <div className="App" >
            <div className="header">
            <h1>Pokemon Codex</h1>
            <em><h4>Gotta catch 'em all!</h4></em>
            <input type="text" placeholder="Try me!" onChange={(e)=> {
                setSearch(e.target.value)
            }} />
            </div>
            {/* <button onClick={() => setPokemon([])}>Reset</button> */}
            <div className="results" > 
                <div className="wrap">{
                        filteredPokemons.map((pokemon) => (
                            <div className="boxes">
                                
                                <div className="id"> <em><small>#{pokemon.id}</small></em>  </div>
                                {/* <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(pokemon.id)}.png`} alt={pokemon.name}/>  */}
                                <LazyLoadImage src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} effect='blur'/>
                                {/* <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name}/> */}
                                <div className="name"> <em>{pokemon.name}</em>  </div>
                                <div className="type"> <small>Type : <em>{pokemon.types.map(type => type.type.name).join(', ')}</em></small> </div>
                                <div className="ability"><small>Ability : <em>{pokemon.abilities[0].ability.name}</em></small> </div>
                                <div className="weight"><small>Weight : <em>{pokemon.weight}</em></small> </div>
                                <div className="height"><small>Height : <em>{pokemon.height}</em></small> </div>
                                    
                            </div>
                        ))
                    } 
                </div>
            </div> 
        </div>
    );
}

export default App;